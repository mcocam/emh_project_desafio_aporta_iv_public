

const descMorbidityCard = async (Schema, req, res) => {

    let result = {
        top10: [],
        morbidity: null
    }

    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let levelEmh = 'prov_hosp';
    if (req.body.level === 'Comunidades'){
        levelEmh = 'ccaa_hosp';
    }

    let levelPadron = 'provincia';
    if (req.body.level === 'Comunidades'){
        levelPadron = 'ccaa';
    }

    taxQuery = {
        name: `desc-morbidity-card-${levelEmh}`,
        text: `SELECT 
                    SUM(f)/(
                        SELECT 
                            SUM(n_pob) 
                        FROM 
                            emh.padron 
                        WHERE 
                            a = $1 
                            AND edad_10 = ANY($4) 
                            AND sexo = ANY($3) 
                            AND ${levelPadron} = ANY($2)
                        ) AS tax 
                FROM 
                    emh.emh_cube 
                WHERE 
                    ccsr = ANY($5) 
                    AND capitulo_short = ANY($6) 
                    AND age_group = ANY($4) 
                    AND ${levelEmh} = ANY($2) 
                    AND sexo = ANY($3) 
                    AND aa = $1`,
        values: [ 
            req.body.year, //$1 
            req.body.entities, //$2
            req.body.gender, //$3
            req.body.age, //$4
            selectedCCSR, //$5
            selectedChapters
        ]
    }

    top10Query = {
        name: `desc-morbidity-card-top10-${levelEmh}`,
        text: `SELECT 
                    ccsr, 
                    SUM(f) AS discharges 
                FROM 
                    emh.emh_cube 
                WHERE 
                    ccsr = ANY($5) 
                    AND capitulo_short = ANY($6) 
                    AND age_group = ANY($4) 
                    AND ${levelEmh} = ANY($2) 
                    AND sexo = ANY($3) 
                    AND aa = $1 
                GROUP BY 
                    ccsr 
                ORDER BY 
                    discharges DESC 
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


        const tax = await Schema
                                .query(taxQuery);
        const top10 = await Schema
                                .query(top10Query);

        result.morbidity = tax.rows.map(d => d.tax*100000 || 0)[0];
        result.top10 = top10.rows.map( d => d );

        res.send(result);

    }catch(e){
        console.log(e);
    }


}

module.exports = descMorbidityCard;