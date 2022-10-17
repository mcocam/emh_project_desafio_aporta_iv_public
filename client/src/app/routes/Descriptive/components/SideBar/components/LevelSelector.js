import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';
import { boxStyles } from './boxStyles';

import { useSelector, useDispatch } from 'react-redux';
import { descSetLevel } from '../../../../../redux/slices/descriptiveSlices/descriptiveSlice';

export const LevelSelector = () => {

    const dispatch = useDispatch();
    const level = useSelector( (state) => state.descriptive.level );

    const handleChange = (event) => {
        dispatch(descSetLevel(event.target.value));
    };

    return(
        <Box sx={boxStyles}>

            <FormControl >
                <RadioGroup
                    aria-labelledby="desc-level-label"
                    value={level}
                    name="radio-buttons-group"
                >
                    <FormControlLabel sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}  value={"Provincias"} onChange={handleChange} control={<Radio />} label={<Typography sx={{fontSize: 14}}>Provincias</Typography>} />
                    <FormControlLabel sx={{'& .MuiSvgIcon-root': {fontSize: 15}}} value={"Comunidades"} onChange={handleChange} control={<Radio />} label={<Typography sx={{fontSize: 14}}>Comunidades</Typography>} />
                </RadioGroup>
            </FormControl>

        </Box>
    )
}