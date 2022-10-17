
const homeMorbidity = async (Schema, req, res) => {

    let response = {
        tax: [],
        taxBySex: [],
        top10: []
    }

    const taxQuery = {
        name: 'home-tax-years',
        text: 'SELECT emh.a, (emh.f/padron.pob)*100000 AS tax FROM (SELECT aa AS a, SUM(f) AS f FROM emh.home_cube WHERE aa = ANY($1) GROUP BY aa) emh LEFT JOIN (SELECT a, SUM(n_pob) AS pob FROM emh.padron WHERE a = ANY($1) GROUP BY a) padron ON emh.a = padron.a ORDER BY emh.a ASC',
        values: [ [req.body.time, req.body.time-1] ]
    }
    const taxBySexQuery = {
        name: 'home-tax-by-sex',
        text: 'SELECT emh.sexo, (emh.f/padron.pob)*100000 AS tax FROM (SELECT sexo, SUM(f) AS f FROM emh.home_cube WHERE aa = ANY($1) GROUP BY sexo) emh LEFT JOIN (SELECT sexo, SUM(n_pob) AS pob FROM emh.padron WHERE a = ANY($1) GROUP BY sexo) padron ON emh.sexo = padron.sexo ORDER BY emh.sexo ASC',
        values: [ [req.body.time] ]
    }
    const top10Query = {
        name: 'home-morbidity-top-10',
        text: 'SELECT capitulo_short AS capitulo, SUM(f) discharges FROM emh.home_cube WHERE capitulo_short <> $1  GROUP BY capitulo_short ORDER BY discharges DESC LIMIT 10',
        values: [ '--' ]
    }

    try{

        tax = await Schema.query(taxQuery);
        taxBySex = await Schema.query(taxBySexQuery);
        top10 = await Schema.query(top10Query);

        response.tax = tax.rows;
        response.taxBySex = taxBySex.rows;
        response.top10 = top10.rows;

        res.send(response);

    }catch(e){
        console.log(e);
    }

}

module.exports = homeMorbidity;