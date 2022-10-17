const fillPyramidKpi = require("../functions/fillPyramidKpi")
const getPyramidColors = require("../functions/pyramidColors");

const kpiPyramidMorbidity = async (Schema, req, res) => {

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

    let levelPadron = 'provincia';
    if (level === 'Comunidades'){
        levelPadron = 'ccaa';
    }

    const queryMorbidityId = `kpi-morb-pyramid-${levelEmh}-${year}`;

    const morbidityQuery = {
        name: queryMorbidityId,
        text: `SELECT
                    f.c_age,
                    f.age,
                    f.gender,
                    f.population,
                    ROUND(f.observed_discharges,0) AS observed_discharges,
                    ROUND((f.population * COALESCE(m.morbidity_model,0) ),0) AS expected_discharges
                FROM
                    (
                    SELECT
                        p.c_age,
                        p.age,
                        p.gender,
                        p.population,
                        e.observed_discharges
                    FROM
                        (
                        SELECT
                            c_edad_10 AS c_age,
                            edad_10 AS age,
                            sexo AS gender,
                            SUM(n_pob) AS population
                        FROM
                            emh.padron
                        WHERE
                            a = $1
                            AND
                            ${levelPadron} = $2
                        GROUP BY
                            c_edad_10,
                            edad_10,
                            sexo
                        )p
                    LEFT JOIN
                        (
                        SELECT
                            c_age_group AS c_age,
                            sexo AS gender,
                            SUM(f) AS observed_discharges
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
                        GROUP BY
                            c_age_group,
                            sexo
                        ) e
                    ON p.c_age = e.c_age AND p.gender = e.gender
                    ) f
                LEFT JOIN
                    (
                        SELECT
                            p.c_age,
                            p.age,
                            p.gender,
                            e.discharges / p.population AS morbidity_model
                        FROM
                            (
                                SELECT
                                    c_edad_10 AS c_age,
                                    edad_10 AS age,
                                    sexo AS gender,
                                    SUM(n_pob) AS population
                                FROM
                                    emh.padron
                                WHERE
                                    a = $1
                                    AND
                                    ccaa = ANY($3)
                                GROUP BY
                                    c_edad_10,
                                    edad_10,
                                    sexo
                            ) p
                        LEFT JOIN
                            (
                                SELECT
                                    c_age_group AS c_age,
                                    sexo AS gender,
                                    SUM(f) AS discharges
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
                                GROUP BY
                                    c_age_group,
                                    sexo
                            ) e
                        ON p.c_age = e.c_age AND p.gender = e.gender
                    ) m
                ON f.c_age = m.c_age AND f.gender = m.gender
                ORDER BY
                    f.c_age ASC,
                    f.gender ASC`,
        values: [
            year,
            selectedEntity,
            modelEntities,
            selectedCCSR,
            selectedChapters
        ]
    }


    try{
        const response = await Schema.query(morbidityQuery);

        const data = response.rows;

        const filledData = fillPyramidKpi(data, metric, "observed_discharges", "expected_discharges");
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

module.exports = kpiPyramidMorbidity;