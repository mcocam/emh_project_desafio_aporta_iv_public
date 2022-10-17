
const fillTimeSeriesFlux = require('../functions/fillTimeSeriesFlux.js');

const fluxDischarges = async (Schema, req, res) => {

    const {
        year,
        selectedEntity,
        age,
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

    const extraProvId = `flux-prov-discharges-${year}-${level}`;
    const extraCCAAId = `flux-prov-discharges-${year}-${level}`;



    extraProvQuery = {
        name: extraProvId,
        text: `SELECT 
                    fecha_alta AS months, 
                    SUM(f_extra_provincia) AS num,
                    SUM(f) AS den,
                    CASE WHEN SUM(f) = 0 THEN 0 ELSE SUM(f_extra_provincia)/ SUM(f) END AS percent
                FROM 
                    emh.emh_cube
                WHERE 
                    aa = $1
                    AND
                    ${levelEmh} = $2
                    AND
                    age_group = ANY($3)
                    AND
                    ccsr = ANY($4)
                    AND
                    capitulo_short = ANY($5)
                GROUP BY 
                    fecha_alta`,
        values: [ 
                year,
                selectedEntity,
                age,
                selectedCCSR,
                selectedChapters
                ]
    }

    extraCCAAQuery = {
        name: extraCCAAId,
        text: `SELECT 
                    fecha_alta AS months, 
                    SUM(f_extra_ccaa) AS num,
                    SUM(f) AS den,
                    CASE WHEN SUM(f) = 0 THEN 0 ELSE SUM(f_extra_ccaa)/ SUM(f) END AS percent
                FROM 
                    emh.emh_cube
                WHERE 
                    aa = $1
                    AND
                    ${levelEmh} = $2
                    AND
                    age_group = ANY($3)
                    AND
                    ccsr = ANY($4)
                    AND
                    capitulo_short = ANY($5)
                GROUP BY 
                    fecha_alta`,
        values: [ 
                year,
                selectedEntity,
                age,
                selectedCCSR,
                selectedChapters
                ]
    }

    let query = extraCCAAQuery;
    if (metric === '% Altas de otras provincias'){
        query = extraProvQuery;
    }


    try{

        const response = await Schema.query(query);

        result = fillTimeSeriesFlux(response.rows, year);

        res.send(result);

    }catch(e){
        console.log(e);
    }

}

module.exports = fluxDischarges;