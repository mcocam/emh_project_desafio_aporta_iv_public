
const fillTimeSeries = require('../functions/fillTimeSeries.js');

const descDischargesCard = async (Schema, req, res) => {

    const metric = 'discharges';
    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let discharges = null;
    let level = 'prov_hosp';
    let queryId = 'desc-discharges-prov-hosp';

    if (req.body.level === 'Comunidades'){
        level = 'ccaa_hosp';
        queryId = 'desc-discharges-ccaa-hosp';
    }

    dischargesQuery = {
        name: queryId,
        text: `SELECT 
                    fecha_alta AS months, 
                    SUM(f) AS discharges 
                FROM 
                    emh.emh_cube 
                WHERE 
                    ccsr = ANY($5) 
                    AND capitulo_short = ANY($6) 
                    AND age_group = ANY($4) 
                    AND ${level} = ANY($2) 
                    AND sexo = ANY($3) 
                    AND aa = $1 
                GROUP BY 
                    fecha_alta`,
        values: [ 
                    req.body.year, //$1 
                    req.body.entities, //$2
                    req.body.gender, //$3
                    req.body.age, //$4
                    selectedCCSR, //$5
                    selectedChapters
                ]
    }

    try{

        discharges = await Schema
                                .query(dischargesQuery);

        discharges = fillTimeSeries(discharges.rows, req.body.year, metric);

        res.send(discharges);

    }catch(e){
        console.log(e);
    }

}

module.exports = descDischargesCard;