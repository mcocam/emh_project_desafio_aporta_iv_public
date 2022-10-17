

const kpiMorbidityCard = async (Schema, req) => {

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
    let padronQueryLevel = 'provincia';

    if (level === 'Comunidades'){
        emhQueryLevel = 'ccaa_hosp';
        padronQueryLevel = 'ccaa';
    }

    const modelQueryId = `kpi-mor-card-mpop-${level}-${year}`;
    const targetQueryId = `kpi-mor-card-tpop-${level}-${year}`;

    const modelQuery = {
        name: modelQueryId,
        text: `SELECT
                    p.c_edad_10 AS c_age,
                    p.edad_10 AS age,
                    p.sexo AS gender,
                    e.discharges / p.n_pob AS morbidity_model
                FROM
                    (
                        SELECT
                            c_edad_10,
                            edad_10,
                            sexo,
                            SUM(n_pob) AS n_pob
                        FROM
                            emh.padron
                        WHERE
                            a = $1
                            AND
                            edad_10 = ANY($2)
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
                                c_age_group,
                                sexo,
                                SUM(f) AS discharges
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
                            GROUP BY
                                c_age_group,
                                sexo
                        ) e
                        ON p.c_edad_10 = e.c_age_group AND p.sexo = e.sexo
                `,
            values: [
                year,
                age,
                modelEntities,
                selectedCCSR,
                selectedChapters
            ]
    }

    const targetQuery = {
        name: targetQueryId,
        text: `SELECT
                    p.${padronQueryLevel} AS target_entities,
                    p.c_edad_10 AS c_age,
                    p.edad_10 AS age,
                    p.sexo AS gender,
                    p.n_pob AS population,
                    e.discharges AS observed_discharges
                FROM
                    (
                        SELECT
                            ${padronQueryLevel},
                            c_edad_10,
                            edad_10,
                            sexo,
                            SUM(n_pob) AS n_pob
                        FROM
                            emh.padron
                        WHERE
                            a = $1
                            AND
                            edad_10 = ANY($2)
                        GROUP BY
                            ${padronQueryLevel},
                            c_edad_10,
                            edad_10,
                            sexo
                    )p
                    LEFT JOIN
                        (
                            SELECT
                                ${emhQueryLevel},
                                c_age_group,
                                sexo,
                                SUM(f) AS discharges
                            FROM
                                emh.emh_cube_kpi_target
                            WHERE
                                aa = $1
                                AND
                                age_group = ANY($2)
                                AND
                                ccsr = ANY($3)
                                AND
                                capitulo_short = ANY($4)
                            GROUP BY
                                ${emhQueryLevel},
                                c_age_group,
                                sexo
                        )e
                        ON p.c_edad_10 = e.c_age_group AND p.sexo = e.sexo AND p.${padronQueryLevel} = e.${emhQueryLevel}
                `,
                values: [
                    year,
                    age,
                    selectedCCSR,
                    selectedChapters
                ]
    }

    try{
        const modelResponse = await Schema.query(modelQuery);
        const targetResponse = await Schema.query(targetQuery);

        const modelData = modelResponse.rows;
        const targetData = targetResponse.rows;

        return {modelData, targetData}


    }catch(e){
        console.log(e);
    }

}


module.exports = kpiMorbidityCard;