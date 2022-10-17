import {useState, useEffect} from 'react';
import { checkEmptyArraysFlux } from '../../../../../../functions/checkEmptyArraysFlux';
import { checkNullObject } from '../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { fetchFlux } from '../../../../../../functions/fetchFlux';
import { useSelector } from 'react-redux';
import { MapLeaflet } from './MapLeaflet';

export const MapCard = () => {

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

    const [map, setMap] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysFlux(selection) && !selection.levelChange){
                fetchFlux('api/flux/map', selection, setIsFetching, setMap);
            }
        }

    },
    [age,ccsr,chapters,fluxIsFetching,levelChange,year,level, delay, gender, metric]);
    
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
                <Typography sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>Mapa %</Typography>
                <Divider sx={{marginLeft: '-1rem', marginRight: '-1rem'}}/>
                <MapLeaflet data={map} level={level} selectedEntity={selectedEntity}/>
            </Paper>
        </Grid>
        )
    }

}