const fs = require("fs");
const path = require("path");
const fillMap = require("../functions/fillMap");

const kpiLosMap = async (Schema, req, res) => {

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

    const queryLosMapId = `kpi-los-map-${levelEmh}-${year}`;

    const losQuery = {
        name: queryLosMapId,
        text: `SELECT
                    ff.entities,
                    CASE WHEN ff.expected_los = 0 THEN 0 ELSE ff.observed_los/ff.expected_los END AS metric
                FROM
                    (
                    SELECT
                        f.entities,
                        CASE WHEN SUM(f.den_los_o) = 0 THEN 0 ELSE SUM(f.num_los_o)/SUM(f.den_los_o) END AS observed_los,
                        CASE WHEN SUM(f.den_los_o) = 0 THEN 0 ELSE SUM(f.num_los_e)/SUM(f.den_los_o) END AS expected_los
                    FROM
                        (
                        SELECT
                        t.entities,
                        t.c_age,
                        t.gender,
                        t.ccsr,
                        t.dx_type,
                        t.num_los_o,
                        t.den_los_o,
                        t.den_los_o * COALESCE(m.los_model,0)  AS num_los_e
                    FROM
                        (SELECT
                            ${levelEmh} AS entities,
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
                            age_group = ANY($2)
                            AND
                            ccsr = ANY($3)
                            AND
                            capitulo_short = ANY($4)
                            AND
                            ccsr != 'Alta sin diagnóstico'
                        GROUP BY
                            ${levelEmh},
                            c_age_group,
                            sexo,
                            ccsr,
                            tipo_dx)t
                
                        LEFT JOIN
                            (SELECT
                                c_age_group AS c_age,
                                sexo AS gender,
                                ccsr,
                                tipo_dx AS dx_type,
                                CASE WHEN (SUM(f_den_estancia_depurada)) = 0 THEN 0 ELSE SUM(f_num_estancia_depurada) / SUM(f_den_estancia_depurada) END AS los_model
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
                        f.entities
                    
                    )ff`,
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

        const response = await Schema.query(losQuery);

        const mapData = response.rows;
        const filledMapData = fillMap(mapData, level);

        map = JSON.parse(map);

        map.mapData = filledMapData;

        res.send(map);

    }catch(e){
        console.log(e);
    }
}

module.exports = kpiLosMap;