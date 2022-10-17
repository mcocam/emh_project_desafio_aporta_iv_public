

const homeAvgStay = async (Schema, req, res) => {

    let response = {
        timeSeries: {},
        avg: {},
        avgBySex: {}
    }

    const yearAvgStayQuery = {
        name: 'home-avg-stay-total',
        text: 'SELECT aa AS a,  SUM(dias_estancia)/SUM(f) AS wAvgStay FROM emh.home_cube WHERE aa = ANY($1) GROUP BY aa ORDER BY aa ASC',
        values: [ [req.body.time, req.body.time-1] ]
     }

     const timeSeriesStayAvgQuery = {
        name: 'home-avg-time',
        text: 'SELECT fecha_alta,  SUM(dias_estancia)/SUM(f) AS wAvgStay FROM emh.home_cube WHERE aa = ANY($1) GROUP BY fecha_alta ORDER BY fecha_alta ASC',
        values: [ [req.body.time] ]
     }

     const sexAvgStayQuery = {
        name: 'home-avg-sex',
        text: 'SELECT sexo,  SUM(dias_estancia)/SUM(f) AS wAvgStay FROM emh.home_cube WHERE aa = ANY($1) GROUP BY sexo ORDER BY sexo ASC',
        values: [ [req.body.time] ]
     }

    try{

        const avg = await Schema
                            .query(yearAvgStayQuery)

        const timeSeries = await Schema
                                    .query(timeSeriesStayAvgQuery)

        const avgBySex = await Schema
                                    .query(sexAvgStayQuery);

        response.timeSeries = timeSeries.rows;
        response.avg = avg.rows;
        response.avgBySex = avgBySex.rows;

        res.send(response);

    }catch(e){
        res.send(e);
    }
}

module.exports = homeAvgStay;