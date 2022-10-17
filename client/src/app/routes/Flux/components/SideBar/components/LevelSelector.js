import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography} from '@mui/material';
import { boxStyles } from './boxStyles';
import { fluxSetEntity } from '../../../../../redux/slices/fluxSlice/fluxSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fluxSetLevel } from '../../../../../redux/slices/fluxSlice/fluxSlice';

export const LevelSelector = () => {

    const dispatch = useDispatch();
    const level = useSelector( (state) => state.flux.level );

    const handleChange = (event) => {
        dispatch(fluxSetLevel(event.target.value));

        if (event.target.value === "Provincias"){
            dispatch(fluxSetEntity("Lleida"));
        }else{
            dispatch(fluxSetEntity("Catalunya")); 
        }
    };

    return(
        <Box sx={boxStyles}>

            <FormControl >
                <RadioGroup
                    aria-labelledby="desc-level-label"
                    value={level}
                    name="radio-buttons-group"
                    onChange={handleChange}
                >
                    <FormControlLabel sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}  value={"Provincias"} control={<Radio />} label={<Typography sx={{fontSize: 14}}>Provincias</Typography>} />
                    <FormControlLabel sx={{'& .MuiSvgIcon-root': {fontSize: 15}}} value={"Comunidades"} control={<Radio />} label={<Typography sx={{fontSize: 14}}>Comunidades</Typography>} />
                </RadioGroup>
            </FormControl>

        </Box>
    )
}