

const fillTimeSeriesFlux = (obj, year, metric) => {

    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    const monthSeries = months.map(d => String(year)+"-"+d+"-01" );

    const filledSeries = monthSeries.map(d => {

        const data = obj.find(f => f.months === d);

        if (data){
            return({
                months: data.months,
                num: data.num,
                den: data.den,
                percent: data.percent
            });
        }else{
            return({
                months: d,
                num: 0,
                den: 0,
                percent: 0
            });
        }


    });

    return(filledSeries);
}

module.exports = fillTimeSeriesFlux;