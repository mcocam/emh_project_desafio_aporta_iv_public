export const computeJenksMatrices = (data, nClasses) => {

    let lower_class_limits = [];
    let variance_combinations = [];

    let i;
    let j;

    let variance = 0;

    for (i = 0; i<data.length + 1; i++){
        let temp1 = [];
        let temp2 = [];
        for (j = 0; j < nClasses + 1; j++){
            temp1.push(0);
            temp2.push(0);
        }
        lower_class_limits.push(temp1);
        variance_combinations.push(temp2);
    }

    for (i = 1; i < nClasses + 1; i++){
        lower_class_limits[1][i] = 1;
        variance_combinations[1][i] = 0;
        for (j = 2; j < data.length + 1; j++){
            variance_combinations[j][i] = Infinity;
        }
    }

    for (let l = 2; l < data.length + 1; l++){
        let sum = 0;
        let sum_squares = 0;
        let w = 0;
        let i4 = 0;

        for (let m = 1; m < l + 1; m++){
            let lower_class_limit = l-m+1;
            let val = data[lower_class_limit - 1];
            
            w++;

            sum += val;
            sum_squares += val * val;

            variance = sum_squares - (sum * sum) / w;

            i4 = lower_class_limit -1;

            if (i4 !== 0){
                for (j = 2; j < nClasses + 1; j++){
                    if (variance_combinations[l][j] >= (variance + variance_combinations[i4][j - 1]) ){
                        lower_class_limits[l][j] = lower_class_limit;
                        variance_combinations[l][j] = variance + variance_combinations[i4][j-1];
                    }
                }
            }
        }

        lower_class_limits[l][1] = 1;
        variance_combinations[l][1] = variance;
    }

    return {
        lower_class_limits: lower_class_limits,
        variance_combinations: variance_combinations
    };

};