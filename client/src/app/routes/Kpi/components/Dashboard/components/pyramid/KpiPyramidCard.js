import {useState, useEffect} from 'react';
import { checkEmptyArraysKpi } from '../../../../../../functions/checkEmptyArraysKpi';
import { checkNullObject } from '../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box, FormControl, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { fetchPyramidKpi } from '../../../../../../functions/fetchPyramidKpi';
import { KpiPyramidChart } from './KpiPyramidChart';
import { metrics } from '../metrics';

export const KpiPyramidCard = () => {
    const selection = useSelector( state => state.kpi );
    const [metric, setMetric] = useState(metrics[0]);
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const handleChange = (event) => {
        setMetric(event.target.value);
    }

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysKpi(selection) && !selection.levelChange){
                    fetchPyramidKpi('api/kpi/pyramid', selection, metric, setIsFetching, setData);
            }
        }

    },
    [selection, delay, metric]);

    if (!data){
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
                <Typography sx={{textAlign: 'center', marginBottom: '0.5rem'}}>Pirámide demográfica</Typography>
                <KpiPyramidChart data={data} />
                <FormControl  size="small" fullWidth={true} margin='normal'>
                        <Select
                        id="kpi-pyramid-metric"
                        value={metric}
                        label=""
                        onChange={handleChange}
                        >
                        {metrics.map( (d,i) => {
                            return <MenuItem value={d} key={i}><Typography sx={{fontSize: '0.9rem', color: '#032D3C', textAlign: 'center'}}>{d}</Typography> </MenuItem>
                        })}
                        </Select>
                </FormControl>
            </Paper>
        </Grid>
        )
    }


}