

const fillTimeSeries = require('../functions/fillTimeSeries');

const descExitusCard = async (Schema, req, res) => {

    let level = 'prov_hosp';
    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    if (req.body.level === 'Comunidades'){
        level = 'ccaa_hosp';
    }

    const descExitusQuery = {
        name: `desc-exitus-card-${level}`,
        text: `SELECT 
                    fecha_alta AS months, 
                    SUM(f) AS discharges, 
                    SUM(f_exitus) AS exitus 
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
                    fecha_alta 
                ORDER BY 
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

        const response = await Schema
                                .query(descExitusQuery)

        const discharges = fillTimeSeries(response.rows, req.body.year, 'discharges');
        const exitus = fillTimeSeries(response.rows, req.body.year, 'exitus');
        

        const result = discharges.map((d,i) => {

            if (Number(d.discharges) === 0 || Number(exitus[i].exitus) === 0){
                return ({
                    month: d.months,
                    discharges: Number(d.discharges),
                    exitus: Number(exitus[i].exitus),
                    exitusPercentage: 0
                })
            }else{
                return ({
                    month: d.months,
                    discharges: Number(d.discharges),
                    exitus: Number(exitus[i].exitus),
                    exitusPercentage: Number(exitus[i].exitus) / Number(d.discharges)
                })
            }
            
        } );

        res.send(result);

    }catch(e){
        console.log(e);
    }
}

module.exports = descExitusCard;