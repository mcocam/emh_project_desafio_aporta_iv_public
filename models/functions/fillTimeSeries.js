

const fillTimeSeries = (obj, year, metric) => {

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    const monthSeries = months.map(d => String(year)+"-"+d+"-01" );

    const filledSeries = monthSeries.map(d => {
        if (obj.some(v => v.months === d ) ){
            return({
                months: d,  
                [metric]: obj.filter(v => v.months === d).map(v => v[metric])[0] })
        }else{
            return({
                months: d,  
                [metric]: 0 })
        }
    });

    return(filledSeries);
}

module.exports = fillTimeSeries;