import {useState, useEffect} from 'react';
import { checkEmptyArraysFlux } from '../../../../../../functions/checkEmptyArraysFlux';
import { checkNullObject } from '../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { fetchFlux } from '../../../../../../functions/fetchFlux';
import { useSelector } from 'react-redux';
import { FluxTable } from './FluxTable';

export const TableCard = () => {

    const selection = useSelector( state => state.flux );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysFlux(selection) && !selection.levelChange){
                fetchFlux('api/flux/table', selection, setIsFetching, setData);
            }
        }

    },
    [selection, delay]);

    if (!data){
        return(
        <Grid item xs={12}>
            <Paper sx={{ padding: "1rem" }} elevation={3}>
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            </Paper>
        </Grid>
        )
    }else{
        return(
        <Grid item xs={12}>
            <Paper sx={{ padding: "1rem", opacity: isFetching ? 0.5: 1, transition: 'opacity 0.4s'}} elevation={3}>
                <Typography sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>Procedencia de los pacientes (ᐯ Top 10 CCSR)</Typography>
                <Divider sx={{marginLeft: '-1rem', marginRight: '-1rem', marginBottom: '1rem'}}/>
                <FluxTable data={data} />
            </Paper>
        </Grid>
        )
    }

}