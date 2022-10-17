import { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { descSetDx } from "../../../../../redux/slices/descriptiveSlices/descriptiveSlice";
import { boxStyles } from "./boxStyles";

const translation = {
    "allItemsAreSelected": "Todos los Dx seleccionados",
    "clearSearch": "Borrar búsqueda",
    "clearSelected": "Borrar seleccionados",
    "noOptions": "Sin opciones",
    "search": "Buscar",
    "selectAll": "Seleccionar todos",
    "selectAllFiltered": "",
    "selectSomeItems": "Seleccionar Dx",
    "create": "Create",
}


export const DxSelector = () => {

    const dispatch = useDispatch();
    const [dxList, setDxList] = useState(null);
    const dx = useSelector( (state) => state.catalogue.catalogue.dx );
    const selectedCCSR = useSelector( (state) => state.descriptive.ccsr );
    const selectedDx = useSelector( (state) => state.descriptive.dx );

    const handleChange = (event) => {
        dispatch(descSetDx(event));
    }

    useEffect( () => {
        if (dx && selectedCCSR){

            const ccsrArray = selectedCCSR.map(d => d.label);
            const filteredDx = dx.dx
                                .filter((d, i) => ccsrArray.includes(dx.ccsr[i]) )
                                .map(d => ({label: d, value: d})); 
            setDxList(filteredDx);
            dispatch(descSetDx(filteredDx));
        }
        
    }, 
    [dx,selectedCCSR, dispatch] ); 

    if (!dx || !selectedCCSR || !dxList){
        return(
        <Box sx={boxStyles}>
            <MultiSelect 
                isLoading
                options={[]}
                value={[]}
                labelledBy="Dx"
            />
        </Box>
        )
    }else{
        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-gender-label">Dx</InputLabel>
                <Select
                    multiple
                    id="desc-gender"
                    labelId="desc-gender-label"
                    label="Diagnósticos"
                    onChange={handleChange}
                    value={selectedDx}
                    size="small"
                    MenuProps={{autoFocus: false}}
                    renderValue={(selected) => selected.join(', ')}
                    >
                        {dxList.map( (d, i) =>  (
                            <MenuItem value={d} key={i}>
                                <Checkbox checked={dxList.indexOf(d) > -1} />
                                <ListItemText primary={d} />
                            </MenuItem>
                            ) 
                        )}
                    </Select>
            </FormControl> 
        </Box>
        )
    }
}

