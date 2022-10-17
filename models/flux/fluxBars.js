

const fluxBars = async (Schema, req, res) => {

    const {
        year,
        selectedEntity,
        age,
        gender,
        level,
        ccsr,
        chapters,
        metric
    } = req.body;

    const selectedCCSR = ccsr.map(d => d.label);
    const selectedChapters = chapters.map(d => d.label);

    let levelEmh = 'prov_hosp';
    if (level === "Comunidades"){
        levelEmh = 'ccaa_hosp';
    }

    const extraProvId = `flux-prov-bars-${year}-${level}`;
    const extraCCAAId = `flux-prov-bars-${year}-${level}`;

    extraProvQuery = {
        name: extraProvId,
        text: `SELECT 
                    ${levelEmh} AS entity,
                    CASE WHEN SUM(f) = 0 THEN 0 ELSE SUM(f_extra_provincia)*100/ SUM(f) END AS metric
                FROM 
                    emh.emh_cube
                WHERE 
                    aa = $1
                    AND
                    age_group = ANY($2)
                    AND
                    sexo = ANY($5)
                    AND
                    ccsr = ANY($3)
                    AND
                    capitulo_short = ANY($4)
                GROUP BY 
                    ${levelEmh}
                ORDER BY
                    metric DESC`,
        values: [ 
                year,
                age,
                selectedCCSR,
                selectedChapters,
                gender
                ]
    }

    extraCCAAQuery = {
        name: extraCCAAId,
        text: `SELECT 
                    ${levelEmh} AS entity,
                    CASE WHEN SUM(f) = 0 THEN 0 ELSE SUM(f_extra_ccaa)*100/ SUM(f) END AS metric
                FROM 
                    emh.emh_cube
                WHERE 
                    aa = $1
                    AND
                    age_group = ANY($2)
                    AND
                    sexo = ANY($5)
                    AND
                    ccsr = ANY($3)
                    AND
                    capitulo_short = ANY($4)
                GROUP BY 
                    ${levelEmh}
                ORDER BY
                    metric DESC`,
        values: [ 
                year,
                age,
                selectedCCSR,
                selectedChapters,
                gender
                ]
    }

    let query = extraCCAAQuery;
    if (metric === '% Altas de otras provincias'){
        query = extraProvQuery;
    }

    try{

        const response = await Schema.query(query);

        res.send(response.rows);

    }catch(e){
        console.log(e);
    }


}

module.exports = fluxBars;