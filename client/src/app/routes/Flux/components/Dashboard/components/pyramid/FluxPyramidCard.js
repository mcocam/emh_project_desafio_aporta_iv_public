import {useState, useEffect} from 'react';
import { checkEmptyArraysFlux } from '../../../../../../functions/checkEmptyArraysFlux';
import { checkNullObject } from '../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { fetchFlux } from '../../../../../../functions/fetchFlux';
import { FluxPyramidChart } from './FluxPyramidChart';

export const FluxPyramidCard = () => {
    const selection = useSelector( state => state.flux );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {

        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysFlux(selection) && !selection.levelChange){
                    fetchFlux('api/flux/pyramid', selection, setIsFetching, setData);
            }
        }

    },
    [selection, delay]);

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
                <Typography sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>Pirámide demográfica %</Typography>
                <Divider sx={{marginLeft: '-1rem', marginRight: '-1rem'}}/>
                <FluxPyramidChart data={data} />
            </Paper>
        </Grid>
        )
    }


}