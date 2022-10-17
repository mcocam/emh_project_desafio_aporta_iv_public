import { useEffect, useState } from "react";
import { Box, Typography} from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { fluxSetChapters } from "../../../../../redux/slices/fluxSlice/fluxSlice";
import { boxStyles } from "./boxStyles";
import { getUniqueValues } from "../../../../../functions/getUniqueValues";

const translation = {
    "allItemsAreSelected": "Todos seleccionado",
    "clearSearch": "Borrar búsqueda",
    "clearSelected": "Borrar seleccionados",
    "noOptions": "Sin opciones",
    "search": "Buscar",
    "selectAll": "Seleccionar todos",
    "selectAllFiltered": "Añadir selección",
    "selectSomeItems": "Seleccionar capítulos",
    "create": "Create",
}


export const DxChapterSelector = () => {

    const dispatch = useDispatch();
    const [chapterList, setChapterList] = useState(null);
    const dxList = useSelector( (state) => state.catalogue.catalogue.dx );
    const selectedChapters = useSelector( (state) => state.flux.chapters );

    const handleChange = (event) => {
        dispatch(fluxSetChapters(event));
    }

    useEffect( () => {
        if (dxList){
            const uniqueChapters = dxList
                                        .map(d => d.capitulo)
                                        .filter(getUniqueValues)
                                        .sort((a,b) => {
                                            if(a < b) { return -1; }
                                            if(a > b) { return 1; }
                                            return 0;
                                        })
                                        .map(d => ({label: d, value: d}));
            setChapterList(uniqueChapters);
            dispatch(fluxSetChapters(uniqueChapters));
        }
        
    }, 
    [dxList, dispatch] ); 

    if (!dxList || !selectedChapters || !chapterList){
        return(
        <Box sx={boxStyles}>
            <Typography sx={{fontSize: '0.8rem', fontWeight: 'bold'}}>Capítulos CIE-10 (filtra CCSR)</Typography>
            <MultiSelect 
                isLoading
                options={[]}
                value={[]}
                labelledBy="Capítulos CIE-10"
            />
        </Box>
        )
    }else{
        return(
        <Box sx={boxStyles}>
            <Typography sx={{fontSize: '0.8rem', fontWeight: 'bold'}}>Capítulos CIE-10 (filtra CCSR)</Typography>
            <MultiSelect 
                overrideStrings={translation}
                options={chapterList}
                value={selectedChapters}
                onChange={handleChange}
                labelledBy="Capítulos CIE-10"
            />
        </Box>
        )
    }
}