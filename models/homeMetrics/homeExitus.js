const homeExitus = async (Schema, req, res) => {

    let response = {
        timeSeries: {},
        total: {},
        bySex: {}
    }

    const timeSeriesQuery = {
        name: 'home-exitus-series',
        text: 'SELECT fecha_alta, SUM(f_exitus)/SUM(f) AS exitus_p FROM emh.home_cube WHERE aa = ANY($1) GROUP BY fecha_alta ORDER BY fecha_alta ASC',
        values: [ [req.body.time] ]
     }

     const totalQuery = {
        name: 'home-exitus-total',
        text: 'SELECT aa AS a, SUM(f_exitus) as exitus FROM emh.home_cube WHERE aa = ANY($1) GROUP BY aa ORDER BY aa ASC',
        values: [ [req.body.time, req.body.time-1] ]
     }

     const bySexQuery = {
        name: 'home-exitus-sex',
        text: 'SELECT sexo,  SUM(f_exitus)/SUM(f) AS exitus_p FROM emh.home_cube WHERE aa = ANY($1) GROUP BY sexo ORDER BY sexo ASC',
        values: [ [req.body.time] ]
     }

    try{

        const total = await Schema.query(totalQuery);
        const timeSeries = await Schema.query(timeSeriesQuery);
        const bySex = await Schema.query(bySexQuery);

        response.timeSeries = timeSeries.rows;
        response.total = total.rows;
        response.bySex = bySex.rows;

        res.send(response);

    }catch(e){
        console.log(e);
        res.end();
    }
}

module.exports = homeExitus;