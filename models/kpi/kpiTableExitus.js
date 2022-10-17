const fillPyramidKpi = require("../functions/fillPyramidKpi")
const getPyramidColors = require("../functions/pyramidColors");

const kpiTableExitus = async (Schema, req, res) => {


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

    const queryExitusId = `kpi-exitus-table-${levelEmh}-${year}`;

    const exitusQuery = {
        name: queryExitusId,
        text: `SELECT
                    ff.ccsr,
                    ff.discharges,
                    ff.observed,
                    ff.expected,
                    ff.ratio
                FROM
                    (
                    SELECT
                        f.ccsr,
                        SUM(f.discharges) AS discharges,
                        SUM(f.observed) AS observed,
                        SUM(f.expected) AS expected,
                        CASE WHEN SUM(f.expected) = 0 THEN 0 ELSE SUM(f.observed)/SUM(f.expected) END AS ratio
                    FROM
                        (
                        SELECT
                            t.c_age,
                            t.gender,
                            t.ccsr,
                            t.dx_type,
                            t.observed,
                            t.discharges,
                            t.discharges * COALESCE(m.mortality_model,0) AS expected
                        FROM
                            (
                            SELECT
                                c_age_group AS c_age,
                                sexo AS gender,
                                ccsr,
                                tipo_dx AS dx_type,
                                SUM(f) AS discharges,
                                SUM(f_exitus) AS observed
                            FROM
                                emh.emh_cube_kpi_target
                            WHERE
                                aa = $1
                                AND
                                ${levelEmh} = $3
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
                                tipo_dx
                            )t
                        LEFT JOIN
                            (
                            SELECT
                                c_age_group AS c_age,
                                sexo AS gender,
                                ccsr,
                                tipo_dx AS dx_type,
                                SUM(f_exitus)/ SUM(f) AS mortality_model
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
                                ccaa_hosp != 'Comunitat Valenciana'
                                AND
                                ccsr != 'Alta sin diagnóstico'
                            GROUP BY
                                c_age_group,
                                sexo,
                                ccsr,
                                tipo_dx
                            )m
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
                        ratio DESC
                    )ff`,
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
        const response = await Schema.query(exitusQuery);

        const data = response.rows;

        return JSON.stringify(data);

    }catch(e){
        console.log(e);
    }



}

module.exports = kpiTableExitus;