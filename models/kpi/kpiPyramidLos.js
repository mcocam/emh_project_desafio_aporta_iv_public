const fillPyramidKpi = require("../functions/fillPyramidKpi")
const getPyramidColors = require("../functions/pyramidColors");

const kpiPyramidLos = async (Schema, req, res) => {

    let result = {
        labels: [],
        datasets: []
    };

    const {
        level,
        modelEntities,
        selectedEntity,
        year,
        age,
        ccsr,
        chapters,
        metric
            } = req.body;

    const selectedCCSR = ccsr.map(d => d.label);
    const selectedChapters = chapters.map(d => d.label);

    let levelEmh = 'prov_hosp';
    if (level === 'Comunidades'){
        levelEmh = 'ccaa_hosp';
    }

    const queryLosId = `kpi-los-pyramid-${levelEmh}-${year}`;

    const losQuery = {
        name: queryLosId,
        text: `SELECT
                    f.c_age_group AS c_age,
                    f.age_group AS age,
                    f.sexo AS gender,
                    CASE WHEN SUM(f.f_den_estancia_depurada) = 0 THEN 0 ELSE ROUND((SUM(f.f_num_estancia_depurada) / SUM(f.f_den_estancia_depurada)), 2) END AS observed_los,
              	    CASE WHEN SUM(f.f_den_estancia_depurada) = 0 THEN 0 ELSE ROUND((SUM(f.expected_num_los) / SUM(f.f_den_estancia_depurada)), 2) END AS expected_los
                FROM
                    (
                        SELECT
                            t.c_age_group,
                            t.age_group,
                            t.sexo,
                            t.tipo_dx,
                            t.f_num_estancia_depurada,
                            t.f_den_estancia_depurada,
                            m.los_model,
                            (m.los_model * COALESCE(t.f_den_estancia_depurada,0)) AS expected_num_los
                        FROM
                        (
                            SELECT
                                c_age_group,
                                age_group,
                                sexo,
                                ccsr,
                                tipo_dx,
                                SUM(f_num_estancia_depurada) AS f_num_estancia_depurada,
                                SUM(f_den_estancia_depurada) AS f_den_estancia_depurada
                            FROM
                                emh.emh_cube_kpi_target
                            WHERE
                                aa = $1
                                AND
                                ${levelEmh} = $2
                                AND
                                ccsr = ANY($4)
                                AND
                                capitulo_short = ANY($5)
                                AND
                                ccsr != 'Alta sin diagnóstico'
                            GROUP BY
                                c_age_group,
                                age_group,
                                sexo,
                                ccsr,
                                tipo_dx
                        )t
                        LEFT JOIN
                        (
                        SELECT
                            c_age_group,
                            sexo,
                            ccsr,
                            tipo_dx,
                            CASE WHEN SUM(f_den_estancia_depurada) = 0 THEN 0 ELSE (SUM(f_num_estancia_depurada) / SUM(f_den_estancia_depurada)) END AS los_model
                        FROM
                            emh.emh_cube_kpi_model
                        WHERE
                            aa = $1
                            AND
                            ccaa_hosp = ANY($3)
                            AND
                            ccsr = ANY($4)
                            AND
                            capitulo_short = ANY($5)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            c_age_group,
                            sexo,
                            ccsr,
                            tipo_dx
                        )m
                        ON 
                            t.c_age_group = m.c_age_group 
                            AND 
                            t.sexo = m.sexo 
                            AND 
                            t.ccsr = m.ccsr 
                            AND 
                            t.tipo_dx = m.tipo_dx
                    )f
                GROUP BY
                    f.c_age_group,
                    f.age_group,
                    f.sexo`,
        values: [
            year,
            selectedEntity,
            modelEntities,
            selectedCCSR,
            selectedChapters
        ]
    }


    try{
        const response = await Schema.query(losQuery);

        const data = response.rows;

        const filledData = fillPyramidKpi(data, metric, "observed_los", "expected_los");
        const femaleSeries = filledData.filter(d => d.sexo === "Mujer");
        const maleSeries = filledData.filter(d => d.sexo === "Hombre");

        const femaleColors = getPyramidColors(femaleSeries, age);
        const maleColors = getPyramidColors(maleSeries, age);

        const labels = femaleSeries.map(d => d.age_group);

        const expectedFemaleDataset = {
            type: 'line',
            label: "Mujer (esperado)",
            data: femaleSeries.map(d => d.expected_metric),
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 0
        }

        const expectedMaleDataset = {
            type: 'line',
            label: "Hombre (esperado)",
            data: maleSeries.map(d => -d.expected_metric),
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 0
        }

        const observedFemaleDataset = {
            label: "Mujer (observado)",
            data: femaleSeries.map(d => d.observed_metric),
            backgroundColor: femaleColors.fillColor,
            borderColor: femaleColors.borderColor,
            borderWidth: 1
        }

        const observedMaleDataset = {
            label: "Hombre (observado)",
            data: maleSeries.map(d => -d.observed_metric),
            backgroundColor: maleColors.fillColor,
            borderColor: maleColors.borderColor,
            borderWidth: 2
        }

        result.labels = labels;
        result.datasets.push(expectedFemaleDataset);
        result.datasets.push(expectedMaleDataset);

        result.datasets.push(observedFemaleDataset);
        result.datasets.push(observedMaleDataset);


        res.send(result);

    }catch(e){
        console.log(e);
    }



}

module.exports = kpiPyramidLos;