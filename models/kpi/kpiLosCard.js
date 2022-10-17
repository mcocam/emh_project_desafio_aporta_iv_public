

const kpiLosCard = async (Schema, req) => {

    const {
        level,
        modelEntities,
        year,
        age,
        ccsr,
        chapters
            } = req.body;

    const selectedCCSR = ccsr.map(d => d.label);
    const selectedChapters = chapters.map(d => d.label);

    const modelQueryId = `kpi-los-${level}-${year}`;

    let emhQueryLevel = 'prov_hosp';

    if (level === 'Comunidades'){
        emhQueryLevel = 'ccaa_hosp';
    }

    const losQuery = {
        name: modelQueryId,
        text: `SELECT
                    f.target_entities,
                    f.gender,
                    SUM(f.observed_num_estancia_depurada) AS observed_num_estancia_depurada,
                    SUM(f.observed_den_estancia_depurada) AS observed_den_estancia_depurada,
                    SUM(f.expected_num_estancia_depurada) AS expected_num_estancia_depurada
                FROM
                    (
                    SELECT
                        e.target_entities,
                        e.sexo AS gender,
                        e.age_group,
                        e.ccsr,
                        e.tipo_dx,
                        e.observed_num_estancia_depurada,
                        e.observed_den_estancia_depurada,
                        COALESCE(m.model_los,0) * e.observed_den_estancia_depurada AS expected_num_estancia_depurada
                    FROM
                        (SELECT
                            ${emhQueryLevel} AS target_entities,
                            sexo,
                            age_group,
                            ccsr,
                            tipo_dx,
                            SUM(COALESCE(f_num_estancia_depurada,0)) AS observed_num_estancia_depurada,
                            SUM(COALESCE(f_den_estancia_depurada,0)) AS observed_den_estancia_depurada
                        FROM
                            emh.emh_cube_kpi_target
                        WHERE
                            aa = $1
                            AND
                            age_group = ANY($2)
                            AND
                            ccsr = ANY($4)
                            AND
                            capitulo_short = ANY($5)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            ${emhQueryLevel},
                            sexo,
                            age_group,
                            ccsr,
                            tipo_dx) e
                    LEFT JOIN
                        (
                        SELECT
                            sexo,
                            age_group,
                            ccsr,
                            tipo_dx,
                            CASE WHEN SUM(COALESCE(f_den_estancia_depurada,0)) = 0 THEN 0 ELSE SUM(f_num_estancia_depurada) / SUM(f_den_estancia_depurada) END AS model_los
                        FROM
                            emh.emh_cube_kpi_model
                        WHERE
                            aa = $1
                            AND
                            age_group = ANY($2)
                            AND
                            ccaa_hosp = ANY($3)
                            AND
                            ccsr = ANY($4)
                            AND
                            capitulo_short = ANY($5)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            sexo,
                            age_group,
                            ccsr,
                            tipo_dx
                        ) m
                    ON 
                        e.sexo = m.sexo 
                        AND
                        e.age_group = m.age_group
                        AND
                        e.ccsr = m.ccsr
                        AND
                        e.tipo_dx = m.tipo_dx
                        ) f
                GROUP BY
                    f.target_entities,
                    f.gender
                `,
            values: [
                year,
                age,
                modelEntities,
                selectedCCSR,
                selectedChapters
            ]
    }

    try{
        const response = await Schema.query(losQuery);

        return response.rows;


    }catch(e){
        console.log(e);
    }

}


module.exports = kpiLosCard;