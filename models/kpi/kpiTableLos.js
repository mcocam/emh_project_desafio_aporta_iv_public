const fillPyramidKpi = require("../functions/fillPyramidKpi")
const getPyramidColors = require("../functions/pyramidColors");

const kpiTableLos = async (Schema, req) => {


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

    const queryLosId = `kpi-los-table-${levelEmh}-${year}`;

    const losQuery = {
        name: queryLosId,
        text: `SELECT
                    f.ccsr,
                    SUM(f.den_los_o) AS discharges,
                    SUM(f.num_los_o) AS observed,
                    SUM(f.num_los_e) AS expected,
                    CASE WHEN SUM(f.den_los_o) = 0 THEN 0 ELSE SUM(f.num_los_o) / SUM(f.den_los_o) END AS observed_los,
                    CASE WHEN SUM(f.den_los_o) = 0 THEN 0 ELSE SUM(f.num_los_e) / SUM(f.den_los_o) END AS expected_los,
                    CASE WHEN SUM(f.den_los_o) = 0 OR SUM(f.num_los_e) = 0  THEN 0 ELSE (SUM(f.num_los_o) / SUM(f.den_los_o)) / (SUM(f.num_los_e) / SUM(f.den_los_o)) END AS ratio
                FROM
                    (
                    SELECT
                        t.c_age,
                        t.gender,
                        t.ccsr,
                        t.dx_type,
                        t.num_los_o,
                        t.den_los_o,
                        (COALESCE(m.los_model,0) * t.den_los_o) AS num_los_e
                    FROM
                        (SELECT
                            c_age_group AS c_age,
                            sexo AS gender,
                            ccsr,
                            tipo_dx AS dx_type,
                            SUM(f_num_estancia_depurada) AS num_los_o,
                            SUM(f_den_estancia_depurada) AS den_los_o
                        FROM
                            emh.emh_cube_kpi_target
                        WHERE
                            aa = $1
                            AND
                            ${levelEmh} = $3
                            AND
                            ccsr = ANY($5)
                            AND
                            capitulo_short = ANY($6)
                            AND
                            age_group = ANY($2)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            c_age_group,
                            sexo,
                            ccsr,
                            tipo_dx)t
                
                    LEFT JOIN
                        (SELECT
                            c_age_group AS c_age,
                            sexo AS gender,
                            ccsr,
                            tipo_dx As dx_type,
                            CASE WHEN SUM(f_den_estancia_depurada) = 0 THEN 0 ELSE SUM(f_num_estancia_depurada)/SUM(f_den_estancia_depurada) END AS los_model
                        FROM
                            emh.emh_cube_kpi_model
                        WHERE
                            aa = $1
                            AND
                            ccaa_hosp = ANY($4)
                            AND
                            age_group = ANY($2)
                            AND
                            ccsr = ANY($5)
                            AND
                            capitulo_short = ANY($6)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            c_age_group,
                            sexo,
                            ccsr,
                            tipo_dx)m
                    ON
                        t.c_age = m.c_age
                        AND
                        t.gender = m.gender
                        AND
                        t.ccsr = m.ccsr
                        AND
                        t.dx_type = m.dx_type
                    )f
                GROUP BY
                    f.ccsr
                ORDER BY
                    ratio DESC`,
        values: [
            year,
            age,
            selectedEntity,
            modelEntities,
            selectedCCSR,
            selectedChapters
        ]
    }


    try{
        const response = await Schema.query(losQuery);

        const data = response.rows;

        return JSON.stringify(data);

    }catch(e){
        console.log(e);
    }



}

module.exports = kpiTableLos;