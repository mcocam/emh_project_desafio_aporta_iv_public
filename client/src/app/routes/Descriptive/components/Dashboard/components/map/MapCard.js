import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../functions/checkEmptyArrays'; 
import { checkNullObject } from '../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box, FormControl, MenuItem, Select } from '@mui/material';
import { fetchMap } from '../../../../../../functions/fetchMap';
import { useSelector } from 'react-redux';
import { MapLeaflet } from './MapLeaflet';
import { metrics } from '../metrics';

export const MapCard = () => {

    const [metric, setMetric] = useState(metrics[0]);

    const selection = useSelector( state => state.descriptive );

    const {
        age,
        ccsr,
        chapters,
        isFetching: descIsFetching,
        levelChange,
        year,
        level
    } = useSelector( state => state.descriptive );

    const [map, setMap] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const handleChange = (event) => {
        setMetric(event.target.value);
    }

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchMap('api/descriptive/map', selection, metric, setIsFetching, setMap);
            }
        }

    },
    [age,ccsr,chapters,descIsFetching,levelChange,year,level, delay, metric]);

    
    if (!map){
        return(
        <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: "1rem" }} elevation={3}>
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            </Paper>
        </Grid>
        )
    }else{
        return(
        <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: "1rem", opacity: isFetching ? 0.5: 1, transition: 'opacity 0.4s'}} elevation={3}>
                <Typography sx={{textAlign: 'center', marginBottom: '0.5rem'}}>Mapa</Typography>
                <MapLeaflet data={map} level={selection.level} />
                <FormControl  size="small" fullWidth={true} margin='normal'>
                        <Select
                        id="desc-map-metric"
                        value={metric}
                        label=""
                        onChange={handleChange}
                        >
                        {metrics.map( (d, i) => {
                            return <MenuItem value={d} key={i}><Typography sx={{fontSize: '0.9rem', color: '#032D3C', textAlign: 'center'}}>{d}</Typography> </MenuItem>
                        })}
                        </Select>
                </FormControl>
            </Paper>
        </Grid>
        )
    }

}