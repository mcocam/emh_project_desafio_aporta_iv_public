
const descTop10exitus = async (Schema, req, res) => {

    let result = [];

    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let level = 'prov_hosp';

    if (req.body.level === 'Comunidades'){
        level = 'ccaa_hosp';
    }

    const descExitusQuery = {
        name: `desc-top10-exitus-card-${level}`,
        text: `SELECT 
                    ccsr,
                    SUM(f) AS discharges,
                    SUM(f_exitus) / SUM(f) as exitus
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
                    exitus DESC
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
                                    .query(descExitusQuery);

        if (response.rows.length === 0){
            result = [
                {
                    'ccsr': '--',
                    'discharges': 0,
                    'exitus': 0
            }
            ]
        }else{
            result = response.rows.map( d => {
                return(
                    {
                        'ccsr': d.ccsr,
                        'discharges': +d.discharges,
                        'exitus': +d.exitus
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

module.exports = descTop10exitus;