const fs = require("fs");
const path = require("path");
const fillMap = require("../functions/fillMap");

const kpiMorbidityMap = async (Schema, req, res) => {

    const ccaaPath = path.resolve('data/ccaa.json');
    const provPath = path.resolve('data/provincias.json');

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

    const queryMorbidityMapId = `kpi-morb-map-${levelEmh}-${year}`;

    const morbidityQuery = {
        name: queryMorbidityMapId,
        text: `SELECT
                    f.entity AS entities,
                    SUM(f.observed_discharges) / SUM(f.expected_discharges) AS metric
                FROM
                    (
                    SELECT
                        t.entity,
                        t.c_age,
                        t.gender,
                        t.observed_discharges,
                        p.target_population,
                        m.morbidity_model,
                        m.morbidity_model * p.target_population AS expected_discharges
                    FROM
                        (SELECT
                            ${levelEmh} AS entity,
                            c_age_group AS c_age,
                            sexo AS gender,
                            SUM(f) AS observed_discharges
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
                            ${levelEmh},
                            c_age_group,
                            sexo) t
                
                    LEFT JOIN
                        (
                        SELECT
                            ${levelPadron} AS entity,
                            c_edad_10 AS c_age,
                            sexo AS gender,
                            SUM(n_pob) AS target_population
                        FROM
                            emh.padron
                        WHERE
                            a = $1
                            AND
                            edad_10 = ANY($2)
                        GROUP BY
                            ${levelPadron},
                            c_edad_10,
                            sexo
                        )p
                    ON t.c_age = p.c_age AND t.gender = p.gender AND t.entity = p.entity
                
                    LEFT JOIN
                        (
                        SELECT
                            e.c_age,
                            e.gender,
                            e.model_discharges / p.model_population AS morbidity_model
                        FROM
                            (
                            SELECT
                                c_age_group AS c_age,
                                sexo AS gender,
                                SUM(f) AS model_discharges
                            FROM
                                emh.emh_cube_kpi_model
                            WHERE
                                aa = $1
                                AND
                                age_group = ANY($2)
                                AND
                                ccsr = ANY($3)
                                AND
                                capitulo_short = ANY($4)
                                AND
                                ccaa_hosp = ANY($5)
                            GROUP BY
                                c_age_group,
                                sexo
                            ) e
                        LEFT JOIN
                            (
                            SELECT
                                c_edad_10 AS c_age,
                                sexo AS gender,
                                SUM(n_pob) AS model_population
                            FROM
                                emh.padron
                            WHERE
                                a = $1
                                AND
                                edad_10 = ANY($2)
                                AND
                                ccaa = ANY($5)
                            GROUP BY
                                c_edad_10,
                                sexo
                            ) p
                            ON e.c_age = p.c_age AND e.gender = p.gender
                        )m
                    ON t.c_age = m.c_age AND t.gender = m.gender
                    )f
                GROUP BY
                    f.entity`,
        values: [
            year,
            age,
            selectedCCSR,
            selectedChapters,
            modelEntities            
        ]
    };

    try{

        let map = {};
        if (levelEmh === "prov_hosp"){
            map = fs.readFileSync(provPath);
        }else{
            map = fs.readFileSync(ccaaPath);
        }

        const response = await Schema.query(morbidityQuery);

        const mapData = response.rows;
        const filledMapData = fillMap(mapData, level);

        map = JSON.parse(map);

        map.mapData = filledMapData;

        res.send(map);

    }catch(e){
        console.log(e);
    }
}

module.exports = kpiMorbidityMap;