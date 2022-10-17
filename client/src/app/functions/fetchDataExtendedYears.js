import axios from "axios";

export const fetchDataExtendedYears = async (path,body,setIsFetching,setData) => {

    setIsFetching(true);

    try{
        const {data: response} = await axios.post(path,
            {
                level: body.selection.level,
                entities: body.selection.entities,
                year: body.selection.year,
                years: body.years,
                gender: body.selection.gender,
                age: body.selection.age,
                ccsr: body.selection.ccsr
            }
        );

        setIsFetching(false);

        setData(response);
        return;

    }catch(e){
        console.log(e);
    }

}