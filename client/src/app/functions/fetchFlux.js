import axios from "axios";

export const fetchFlux = async (path,body,setIsFetching,setData) => {

    setIsFetching(true);

    const reqBody = {
        level: body.level,
        selectedEntity: body.selectedEntity,
        gender: body.gender,
        year: body.year,
        age: body.age,
        ccsr: body.ccsr,
        chapters: body.chapters,
        metric: body.metric
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