import {useState, useEffect} from 'react';
import { checkEmptyArraysFlux } from '../../../../../../../functions/checkEmptyArraysFlux';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { fetchFlux } from '../../../../../../../functions/fetchFlux';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { SortedBarsChart } from './SortedBarsChart';


export const SortedBarsCard = () => {

    const selection = useSelector( state => state.flux );
    const {
        age,
        ccsr,
        chapters,
        isFetching: fluxIsFetching,
        levelChange,
        year,
        level,
        metric,
        gender,
        selectedEntity
    } = useSelector( state => state.flux );

    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysFlux(selection) && !selection.levelChange){
                    fetchFlux('api/flux/cards/bars', selection, setIsFetching, setData);
            }
        }

    },
    [age,ccsr,chapters,fluxIsFetching,levelChange,year,level, delay, gender, metric]);
    
    if (!data){
        return(
        <Grid item xs={12} sm={6} md={8}>
            <Paper sx={{ padding: "1rem" }} elevation={3}>
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            </Paper>
        </Grid>
        )
    }else{
        return(
        <Grid item xs={12} sm={6} md={8} alignItems="center" justifyContent="center">
            <Paper sx={{ padding: "1rem", opacity: isFetching ? 0.5: 1, transition: 'opacity 0.4s'}} elevation={3}>
                <SortedBarsChart data={data} selectedEntity={selection.selectedEntity} />
            </Paper>
        </Grid>
        )
    }
}
