import axios from "axios";

export const fetchDataKpi = async (path,body,setIsFetching,setData) => {

    setIsFetching(true);

    const reqBody = {
        level: body.level,
        selectedEntity: body.selectedEntity,
        modelEntities: body.modelEntities,
        year: body.year,
        age: body.age,
        ccsr: body.ccsr,
        chapters: body.chapters
    }


    try{
        const {data: response} = await axios.post(path,
            reqBody
        );

        setData(response);
        setIsFetching(false);
        return;

    }catch(e){
        console.log(e);
    }

}