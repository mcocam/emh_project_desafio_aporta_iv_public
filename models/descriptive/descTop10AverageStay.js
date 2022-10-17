
const descTop10AverageStay = async (Schema, req, res) => {

    let result = [];

    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let level = 'prov_hosp';

    if (req.body.level === 'Comunidades'){
        level = 'ccaa_hosp';
    }

    const descStayQuery = {
        name: `desc-top10-stay-card-${level}`,
        text: `SELECT 
                    ccsr,
                    SUM(f) AS discharges,
                    SUM(dias_estancia) / SUM(f) as avgstay
                FROM emh.emh_cube 
                WHERE 
                    ccsr = ANY($5) 
                    AND capitulo_short = ANY($6) 
                    AND age_group = ANY($4) 
                    AND ${level} = ANY($2) 
                    AND sexo = ANY($3) 
                    AND aa = $1 
                GROUP BY 
                    ccsr 
                ORDER BY 
                    avgstay DESC
                LIMIT 10`,
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

        if (response.rows.length === 0){
            result = [
                {
                    'ccsr': '--',
                    'discharges': 0,
                    'avgstay': 0
            }
            ]
        }else{
            result = response.rows.map( d => {
                return(
                    {
                        'ccsr': d.ccsr,
                        'discharges': +d.discharges,
                        'avgstay': +d.avgstay
                    }
                )
            }

            )
        }

        res.send(result);

    }catch(e){
        console.log(e);
    }

}

module.exports = descTop10AverageStay;