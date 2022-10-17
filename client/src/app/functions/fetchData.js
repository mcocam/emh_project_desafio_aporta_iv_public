import axios from "axios";

export const fetchData = async (path,body,setIsFetching,setData) => {

    setIsFetching(true);

    const reqBody = {
        level: body.level,
        entities: body.entities,
        year: body.year,
        gender: body.gender,
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