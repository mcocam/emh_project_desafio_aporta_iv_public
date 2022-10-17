const fs = require("fs");
const path = require("path");
const fillMap = require("../functions/fillMap");

const kpiMortalityMap = async (Schema, req, res) => {

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

    const queryMortalityMapId = `kpi-mort-map-${levelEmh}-${year}`;

    const morbidityQuery = {
        name: queryMortalityMapId,
        text: `SELECT
                    f.entities,
                    ROUND(SUM(f.observed_exitus) / SUM(f.expected_exitus),3) AS metric
                FROM
                    (
                    SELECT
                        t.entities,
                        t.c_age,
                        t.gender,
                        t.ccsr,
                        t.dx_type,
                        t.observed_exitus,
                        t.observed_discharges * COALESCE(m.mortality_model,0) AS expected_exitus
                    FROM
                        (
                        SELECT
                            ${levelEmh} AS entities,
                            c_age_group AS c_age,
                            sexo AS gender,
                            ccsr AS ccsr,
                            tipo_dx AS dx_type,
                            SUM(f) AS observed_discharges,
                            SUM(f_exitus) AS observed_exitus
                        FROM
                            emh.emh_cube_kpi_target t
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
                            tipo_dx
                        ) t
                    LEFT JOIN
                        (
                        SELECT
                            c_age_group AS c_age,
                            sexo AS gender,
                            ccsr,
                            tipo_dx AS dx_type,
                            SUM(f_exitus) / SUM(f) AS mortality_model
                        FROM
                            emh.emh_cube_kpi_model
                        WHERE
                            aa = $1
                            AND
                            ccaa_hosp != 'Comunitat Valenciana'
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
                    f.entities`,
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

module.exports = kpiMortalityMap;