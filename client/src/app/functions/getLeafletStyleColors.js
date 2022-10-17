import chroma from 'chroma-js';

export const getLeafletStyleColors = (features) => {

    try{

        const nColors = breaks.length;

        if (typeof palette === 'string' || Array.isArray(palette)){

            const colors = chroma.scale(palette).colors(nColors);

            for (const dataValue of result.data){
                let indexClass = 1;

                for (const value of breaks){
                    let color;
                    if (indexClass === nColors){
                        
                        color = colors[indexClass-1];

                        result.class.push(indexClass);
                        result.color.push(color);
                        break;

                    }else{
                        if (dataValue < value){
                            color = colors[indexClass-1];

                            result.class.push(indexClass);
                            result.color.push(color);
                            break;

                        }else{
                            indexClass++;
                        }
                    }
                }

            }
            return result;
        }

        return 'Something gone wrong! palette argument is neither an array nor string';

    }catch(e){
        console.log(e);
    }

    

}