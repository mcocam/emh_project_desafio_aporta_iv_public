
const homeDischarges = async (Schema, req, res) => {

    let response = {
                    timeSeries: [],
                    dxType: [] 
    };


     const timeSeriesQuery = {
        name: 'home-discharges',
        text: 'SELECT aa AS a, fecha_alta, SUM(f) AS discharges FROM emh.home_cube WHERE aa = ANY($1) GROUP BY aa, fecha_alta',
        values: [ [req.body.time, req.body.time-1] ]
     }
     const typeDxQuery = {
        name: 'type-home-discharges',
        text: 'SELECT tipo_dx, SUM(f) AS discharges FROM emh.home_cube WHERE aa = ANY($1) GROUP BY tipo_dx',
        values: [ [req.body.time] ]
     }
    
    try{

        const dischargesTimeSeries = await Schema.query(timeSeriesQuery);
        const dxType = await Schema.query(typeDxQuery);

        response.timeSeries = dischargesTimeSeries.rows;
        response.dxType = dxType.rows;

        res.send(response);

    }catch(e){
        console.log(e);
    }
}

module.exports = homeDischarges;