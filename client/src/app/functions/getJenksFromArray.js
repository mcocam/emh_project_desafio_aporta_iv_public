import { computeJenksMatrices } from './computeJenksMatrices';

export const getJenksFromArray = (data, nClasses) => {

    data = data.slice().sort( (a,b) => {return a-b;} );

    let matrices = computeJenksMatrices(data, nClasses);

    let lower_class_limits = matrices.lower_class_limits;
    let k = data.length - 1;

    let kClass = [];
    let countNum = nClasses;

    kClass[nClasses] = data[data.length - 1];
    kClass[0] = data[0];

    if (kClass.reduce( (acc, value) => acc+value  ) > 0){
        while (countNum > 1){
            kClass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }

        kClass.shift();

        return kClass;

    }else{
        kClass = [0];
        return kClass
    }

    

    


}