

const kpiMortalityCard = async (Schema, req) => {

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

    let emhQueryLevel = 'prov_hosp';

    if (level === 'Comunidades'){
        emhQueryLevel = 'ccaa_hosp';
    }

    const modelQueryId = `kpi-mort-${level}-${year}`;

    const mortalityQuery = {
        name: modelQueryId,
        text: `SELECT
                    f.target_entities,
                    f.gender,
                    SUM(f.observed_exitus) AS observed_exitus,
                    ROUND(SUM(f.expected_exitus),0) AS expected_exitus,
                    CASE WHEN SUM(f.expected_exitus) = 0 THEN 0 ELSE SUM(f.observed_exitus) / SUM(f.expected_exitus) END AS ratio
                FROM
                    (
                    SELECT	
                        e.target_entities,
                        e.sexo AS gender,
                        e.observed_exitus,
                        e.discharges * COALESCE(m.model_mortality,0) AS expected_exitus
                    FROM
                        (
                            SELECT
                                ${emhQueryLevel} AS target_entities,
                                sexo,
                                age_group,
                                ccsr,
                                tipo_dx,
                                SUM(f) AS discharges,
                                SUM(f_exitus) AS observed_exitus
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
                                tipo_dx
                        ) e
                    LEFT JOIN
                        (
                            SELECT
                                sexo,
                                age_group,
                                ccsr,
                                tipo_dx,
                                CASE WHEN SUM(f) = 0 THEN 0 ELSE SUM(f_exitus) / SUM(f) END AS model_mortality
                            FROM
                                emh.emh_cube_kpi_model
                            WHERE
                                aa = $1
                                AND
                                age_group = ANY($2)
                                AND
                                ccaa_hosp = ANY($3)
                                AND
                                ccaa_hosp != 'Comunitat Valenciana'
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
                        )m
                    ON
                        e.sexo = m.sexo
                        AND
                        e.age_group = m.age_group
                        AND
                        e.ccsr = m.ccsr
                        AND
                        e.tipo_dx = m.tipo_dx
                    
                    )f
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
        const response = await Schema.query(mortalityQuery);

        return response.rows


    }catch(e){
        console.log(e);
    }

}


module.exports = kpiMortalityCard;