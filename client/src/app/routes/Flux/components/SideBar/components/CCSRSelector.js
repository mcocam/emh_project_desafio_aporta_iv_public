import { useEffect, useState } from "react";
import { Box, Typography} from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { fluxSetccsr } from "../../../../../redux/slices/fluxSlice/fluxSlice";
import { boxStyles } from "./boxStyles";
import { getUniqueValues } from "../../../../../functions/getUniqueValues";

const translation = {
    "allItemsAreSelected": "Todos los CCSR seleccionados",
    "clearSearch": "Borrar búsqueda",
    "clearSelected": "Borrar seleccionados",
    "noOptions": "Sin opciones",
    "search": "Buscar",
    "selectAll": "Seleccionar todos",
    "selectAllFiltered": "Añadir selección",
    "selectSomeItems": "Seleccionar CCSR",
    "create": "Create",
}


export const CCSRSelector = () => {

    const dispatch = useDispatch();
    const [ccsrList, setCCSRList] = useState(null);
    const dxList = useSelector( (state) => state.catalogue.catalogue.dx );
    const selectedCCSR = useSelector( (state) => state.flux.ccsr );
    const selectedChapters = useSelector( (state) => state.flux.chapters );

    const handleChange = (event) => {
        dispatch(fluxSetccsr(event));
    }

    useEffect( () => {
        if (dxList && selectedChapters){
            const uniqueCCSR = dxList
                                        .filter(d => selectedChapters.map(d => d.label).includes(d.capitulo))
                                        .map(d => d.ccsr)
                                        .filter(getUniqueValues)
                                        .sort((a,b) => {
                                            if(a < b) { return -1; }
                                            if(a > b) { return 1; }
                                            return 0;
                                        })
                                        .map(d => ({label: d, value: d}));
            setCCSRList(uniqueCCSR);
            dispatch(fluxSetccsr(uniqueCCSR));
        }
        
    }, 
    [dxList, selectedChapters, dispatch] ); 

    if (!dxList || !selectedCCSR || !ccsrList || !selectedChapters){
        return(
        <Box sx={boxStyles}>
            <Typography sx={{fontSize: '0.8rem', fontWeight: 'bold'}}>Agrupación CCSR</Typography>
            <MultiSelect 
                isLoading
                options={[]}
                value={[]}
                labelledBy="CCSR"
            />
        </Box>
        )
    }else{
        return(
        <Box sx={boxStyles}>
            <Typography sx={{fontSize: '0.8rem', fontWeight: 'bold'}}>Agrupación CCSR</Typography>
            <MultiSelect 
                overrideStrings={translation}
                options={ccsrList}
                value={selectedCCSR}
                onChange={handleChange}
                labelledBy="CCSR"
            />
        </Box>
        )
    }
}

