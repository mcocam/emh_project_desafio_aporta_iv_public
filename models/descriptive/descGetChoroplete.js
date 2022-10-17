const fs = require("fs");
const path = require("path");
const fillMap = require("../functions/fillMap");

const descGetChoropleth = async (Schema, req, res) => {

    const ccaaPath = path.resolve('data/ccaa.json');
    const provPath = path.resolve('data/provincias.json');

    const metric = req.body.metric;

    let levelEmh = 'prov_hosp';
    if (req.body.level === 'Comunidades'){
        levelEmh = 'ccaa_hosp';
    }

    let levelPadron = 'provincia';
    if (req.body.level === 'Comunidades'){
        levelPadron = 'ccaa';
    }

    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    try {

        let map = {};
        if (levelEmh === "prov_hosp"){
            map = fs.readFileSync(provPath);
        }else{
            map = fs.readFileSync(ccaaPath);
        }


        const mapExitusQuery = {
            name: `desc-map-${req.body.metric.substring(0,3)}-${levelEmh}`,
            text: `
                SELECT
                    ${levelEmh} AS entities,
                    (SUM(f_exitus)/SUM(f))*100 AS metric
                FROM
                    emh.emh_cube
                WHERE
                    ccsr = ANY($1)
                    AND
                    capitulo_short = ANY($2)
                    AND
                    age_group = ANY($3)
                    AND
                    sexo = ANY($4)
                    AND
                    aa = $5
                GROUP BY
                    ${levelEmh}
                `,
            values: [ 
                selectedCCSR,
                selectedChapters,
                req.body.age,
                req.body.gender,
                req.body.year                    
                ]
        }


        const mapAvgQuery = {
            name: `desc-map-${req.body.metric.substring(0,3)}-${levelEmh}`,
            text: `
                    SELECT
                        ${levelEmh} AS entities,
                        SUM(dias_estancia)/SUM(f) AS metric
                    FROM
                        emh.emh_cube
                    WHERE
                        ccsr = ANY($1)
                        AND
                        capitulo_short = ANY($2)
                        AND
                        age_group = ANY($3)
                        AND
                        sexo = ANY($4)
                        AND
                        aa = $5
                    GROUP BY
                        ${levelEmh}
                `,
            values: [ 
                selectedCCSR,
                selectedChapters,
                req.body.age,
                req.body.gender,
                req.body.year                    
                ]
        }

        const mapTaxQuery = {
            name: `desc-map-${req.body.metric.substring(0,3)}-${levelEmh}`,
            text: `
                SELECT
                    emh.${levelEmh} AS entities,
                    (discharges/pob)*100000 AS metric
                FROM
                    (
                        SELECT
                            ${levelEmh},
                            SUM(f) AS discharges
                        FROM
                            emh.emh_cube
                        WHERE
                            ccsr = ANY($1) 
                            AND capitulo_short = ANY($2) 
                            AND aa = $3
                            AND sexo = ANY($4)
                            AND age_group = ANY($5)
                        GROUP BY
                            ${levelEmh}
                    ) emh
    
                    LEFT JOIN
                        (
                            SELECT
                                ${levelPadron},
                                SUM(n_pob) AS pob
                            FROM
                                emh.padron
                            WHERE
                                a = $3
                                AND sexo = ANY($4)
                                AND edad_10 = ANY($5)
                            GROUP BY
                                ${levelPadron}
                        ) padron
                    ON emh.${levelEmh} = padron.${levelPadron}
            `,
        values: [ 
            selectedCCSR,
            selectedChapters,
            req.body.year,
            req.body.gender,
            req.body.age
            ]
        }

        let mapQuery;
        switch(req.body.metric){
            case 'Tasa bruta de morbilidad (100k habitantes)':
                mapQuery = mapTaxQuery;
                break;
            case 'Estancia media (días)':
                mapQuery = mapAvgQuery;
                break;
            case '% de exitus (sobre altas)':
                mapQuery = mapExitusQuery;
                break;
        }

        const response = await Schema
                                    .query(mapQuery);

        const mapData = response.rows;
        const filledMapData = fillMap(mapData, req.body.level);

        map = JSON.parse(map);

        map.mapData = filledMapData;

        res.send(map);

    }catch(e){
        console.log(e);
    }



}

module.exports = descGetChoropleth