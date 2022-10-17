

export const getEqualBreaks = (data, nClasses) => {

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);

    const step = (maxValue - minValue)/(nClasses+1);

    let intervals = [];
    for (let i = 0; i<nClasses; i++){
        if (i === 0){
            intervals.push(minValue + step);
        }else{
            intervals.push(intervals[i-1] + step)
        }
    }

    return intervals;


}