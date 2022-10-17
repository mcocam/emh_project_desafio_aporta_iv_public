import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography} from '@mui/material';
import { boxStyles } from './boxStyles';
import { fluxSetMetric } from '../../../../../redux/slices/fluxSlice/fluxSlice';
import { useSelector, useDispatch } from 'react-redux';


const metrics = [
    '% Altas de otras CCAA',
    '% Altas de otras provincias'
]

export const MetricSelector = () => {

    const dispatch = useDispatch();
    const metric = useSelector( (state) => state.flux.metric );

    const handleChange = (event) => {
        dispatch(fluxSetMetric(event.target.value));
    };

    return(
        <Box sx={boxStyles}>

            <FormControl >
                <RadioGroup
                    aria-labelledby="desc-level-label"
                    value={metric}
                    name="radio-buttons-group"
                    onChange={handleChange}
                >
                    {metrics.map((d,i) => {
                        return <FormControlLabel key={i} sx={{'& .MuiSvgIcon-root': {fontSize: 15}}}  value={d} control={<Radio />} label={<Typography sx={{fontSize: 14}}>{d}</Typography>} />
                    })}                    
                </RadioGroup>
            </FormControl>

        </Box>
    )
}