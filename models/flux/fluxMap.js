const fs = require("fs");
const path = require("path");
const fillMap = require("../functions/fillMap");

const fluxMap = async (Schema, req, res) => {

    const ccaaPath = path.resolve('data/ccaa.json');
    const provPath = path.resolve('data/provincias.json');

    const {
        level,
        gender,
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

    const queryExtraCCAAId = `flux-map-ccaa-${level}-${year}`;
    const queryExtraProvId = `flux-map-prov-${level}-${year}`;

    const queryExtraCCAA = {
        name: queryExtraCCAAId,
        text: `SELECT
                    t.entities,
                    CASE WHEN m.den = 0 THEN 0 ELSE (t.num / m.den)*100 END AS metric
                FROM
                    (
                    SELECT
                        ${levelEmh} AS entities,
                        SUM(f_extra_ccaa) AS num
                    FROM
                        emh.emh_cube_flux
                    WHERE
                        aa = $1
                        AND
                        age_group = ANY($2)
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY 
                        ${levelEmh}
                    )t
                LEFT JOIN
                    (
                        SELECT
                            ${levelEmh} AS entities,
                            SUM(f) AS den
                        FROM
                            emh.emh_cube
                        WHERE
                            aa = $1
                            AND
                            age_group = ANY($2)
                            AND
                            sexo = ANY($3)
                            AND
                            ccsr = ANY($4)
                            AND
                            capitulo_short = ANY($5)
                        GROUP BY
                            ${levelEmh}
                    )m
                ON t.entities = m.entities`,
        values: [
            year,
            age,
            gender,
            selectedCCSR,
            selectedChapters
        ]
    }

    const queryExtraProv = {
        name: queryExtraProvId,
        text: `SELECT
                    t.entities,
                    CASE WHEN m.den = 0 THEN 0 ELSE (t.num / m.den)*100 END AS metric
                FROM
                    (
                    SELECT
                        ${levelEmh} AS entities,
                        SUM(f_extra_prov) AS num
                    FROM
                        emh.emh_cube_flux
                    WHERE
                        aa = $1
                        AND
                        age_group = ANY($2)
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY 
                        ${levelEmh}
                    )t
                LEFT JOIN
                    (
                        SELECT
                            ${levelEmh} AS entities,
                            SUM(f) AS den
                        FROM
                            emh.emh_cube
                        WHERE
                            aa = $1
                            AND
                            age_group = ANY($2)
                            AND
                            sexo = ANY($3)
                            AND
                            ccsr = ANY($4)
                            AND
                            capitulo_short = ANY($5)
                        GROUP BY
                            ${levelEmh}
                    )m
                ON t.entities = m.entities`,
        values: [
            year,
            age,
            gender,
            selectedCCSR,
            selectedChapters
        ]
    }

    let query = '';
    if (metric === '% Altas de otras provincias'){
        query = queryExtraProv;
    }else{
        query = queryExtraCCAA;
    }

    try{

        let map = {};
        if (levelEmh === "prov_hosp"){
            map = fs.readFileSync(provPath);
        }else{
            map = fs.readFileSync(ccaaPath);
        }

        const response = await Schema.query(query);

        const mapData = response.rows;
        const filledMapData = fillMap(mapData, level);

        map = JSON.parse(map);

        map.mapData = filledMapData;

        res.send(map);

    }catch(e){
        console.log(e);
    }
}

module.exports = fluxMap;