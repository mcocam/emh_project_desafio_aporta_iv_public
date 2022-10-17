import axios from "axios";

export const fetchPyramidKpi = async (path,body,metric,setIsFetching,setData) => {

    setIsFetching(true);

    try{
        const {data: response} = await axios.post(path,
            {
                level: body.level,
                modelEntities: body.modelEntities,
                selectedEntity: body.selectedEntity,
                year: body.year,
                gender: body.gender,
                age: body.age,
                ccsr: body.ccsr,
                chapters: body.chapters,
                metric: metric
            }
        );

        setData(response);
        setIsFetching(false);
        return;

    }catch(e){
        console.log(e);
    }

    

    

}