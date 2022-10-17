import { useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Checkbox, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fluxSetGender } from '../../../../../redux/slices/fluxSlice/fluxSlice';
import BeatLoader from 'react-spinners/BeatLoader';
import { boxStyles } from './boxStyles';

export const GenderSelector = () => {

    const dispatch = useDispatch();
    const genderList = useSelector( (state) => state.catalogue.catalogue.sexo );
    const selectedGenders = useSelector( (state) => state.flux.gender );
    
    const handleChange = (event) => {
        if (event.target.value.length === 0){
            dispatch(fluxSetGender(genderList));
        }else{
            dispatch(fluxSetGender(event.target.value));
        }
    } 

    useEffect( () => { 
        dispatch(fluxSetGender(genderList));
    },
    [genderList] )

    if (!genderList || !selectedGenders){

        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-gender-label"><BeatLoader size={6}/></InputLabel>
                <Select
                    multiple
                    id="desc-gender"
                    labelId="desc-gender-label"
                    label="Sexo"
                    value={[]}
                    size="small"
                    MenuProps={{autoFocus: false}}
                    >
                    </Select>
            </FormControl>
        </Box>
        )
    }else{ 

        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-gender-label">Sexo</InputLabel>
                <Select
                    multiple
                    id="desc-gender"
                    labelId="desc-gender-label"
                    label="Sexo"
                    onChange={handleChange}
                    value={selectedGenders}
                    size="small"
                    MenuProps={{autoFocus: false}}
                    renderValue={(selected) => selected.join(', ')}
                    >
                        {genderList.map( (d, i) =>  (
                            <MenuItem value={d} key={i}>
                                <Checkbox checked={selectedGenders.indexOf(d) > -1} />
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