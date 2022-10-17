import chroma from 'chroma-js';

export const getScaleColor = (data, breaks, palette) => {
    // Palette can be a string from valid chroma-js palette or an array from-to colors

    try{

        let result = {
            id: data.map(d => d.entities),
            data: data.map(d => d.metric),
            class: [],
            color: [],
            scaleDict: {
                minValue: [],
                maxValue: [],
                color: []
            }
        }

        const nColors = breaks.length;

        if (typeof palette === 'string' || Array.isArray(palette)){

            const colors = chroma.scale(palette).colors(nColors);

            for (let i=0; i<nColors; i++){
                if (i===0){
                    result.scaleDict.minValue.push(0);
                    result.scaleDict.maxValue.push(breaks[i]);
                    result.scaleDict.color.push(colors[i]);
                }else{
                    result.scaleDict.minValue.push(breaks[i-1]);
                    result.scaleDict.maxValue.push(breaks[i]);
                    result.scaleDict.color.push(colors[i]);
                }


            }

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