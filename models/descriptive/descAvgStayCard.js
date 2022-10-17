const fillTimeSeries = require('../functions/fillTimeSeries');

const descAvgStayCard = async (Schema, req, res) => {

    let result = {
        avgStay: null,
        timeSeries: null
    };

    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let level = 'prov_hosp';

    if (req.body.level === 'Comunidades'){
        level = 'ccaa_hosp';
    }

    const descStayQuery = {
        name: `desc-stay-card-${level}`,
        text: `SELECT 
                    fecha_alta AS months, 
                    SUM(dias_estancia) AS stay, 
                    SUM(f) AS discharges 
                FROM emh.emh_cube 
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
                                    .query(descStayQuery);

        const totalDischarges = response.rows
                                            .map(d => +d.discharges)
                                            .reduce( (a,b) => a+b,0 );
        const totalStay = response.rows
                                            .map(d => +d.stay)
                                            .reduce( (a,b) => a+b,0 );

        const dischargesSeries = fillTimeSeries(response.rows, req.body.year, 'discharges');
        const staySeries = fillTimeSeries(response.rows, req.body.year, 'stay');

        result.timeSeries = dischargesSeries.map( (d,i) => {

            if (Number(staySeries[i].stay) === 0 || Number(d.discharges) === 0){

                return ({
                    months: d.months,
                    stay: 0
                })

            }else{
                return(
                    {
                        months: d.months,
                        stay: Number(staySeries[i].stay) / Number(d.discharges) 
                    }
                )
            }
            
        }
        );

        if (totalDischarges === 0 || totalStay === 0){
            result.avgStay = 0;
        }else{
            result.avgStay = totalStay / totalDischarges;
        }

        res.send(result);

    }catch(e){
        console.log(e);
    }
}

module.exports = descAvgStayCard;