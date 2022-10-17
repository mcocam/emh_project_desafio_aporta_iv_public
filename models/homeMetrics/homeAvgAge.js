const homeAvgAge = async (Schema, req, res) => {

    let response = {
        timeSeries: {},
        avg: {},
        avgBySex: {}
    }

    const timeSeriesQuery = {
        name: 'home-avg-age-series',
        text: 'SELECT fecha_alta, SUM(edad_a)/SUM(f) AS wage FROM emh.home_cube WHERE aa = ANY($1) GROUP BY fecha_alta ORDER BY fecha_alta ASC',
        values: [ [req.body.time] ]
     }

     const avgQuery = {
        name: 'home-avg-age-total',
        text: 'SELECT aa AS a, SUM(edad_a)/SUM(f) AS wage FROM emh.home_cube WHERE aa = ANY($1) GROUP BY aa ORDER BY aa ASC',
        values: [ [req.body.time, req.body.time-1] ]
     }

     const avgBySexQuery = {
        name: 'home-avg-age-sex',
        text: 'SELECT sexo,  SUM(edad_a)/SUM(f) AS wage FROM emh.home_cube WHERE aa = ANY($1) GROUP BY sexo ORDER BY sexo ASC',
        values: [ [req.body.time] ]
     }

    try{

        const avg = await Schema.query(avgQuery);
        const timeSeries = await Schema.query(timeSeriesQuery);
        const avgBySex = await Schema.query(avgBySexQuery);

        response.timeSeries = timeSeries.rows;
        response.avg = avg.rows;
        response.avgBySex = avgBySex.rows;

        res.send(response);

    }catch(e){
        res.send(e);
    }
}

module.exports = homeAvgAge;