

const roundedSum = (arr) => {

    let sum = arr.reduce( (acc, obj) => {
        return acc + obj}, 0 
        );
    sum = Math.round(sum);

    return sum;
    
}

export default roundedSum;