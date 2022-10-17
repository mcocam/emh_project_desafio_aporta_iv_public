import {useState, useEffect} from 'react';
import { checkEmptyArraysFlux } from '../../../../../../../functions/checkEmptyArraysFlux';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { fetchFlux } from '../../../../../../../functions/fetchFlux';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import prettifyInt from '../../../../../../../functions/prettifyInt';
import { roundTo } from 'round-to';
import prettifyNumber from '../../../../../../../functions/prettifyNumber';
import { MonthChart } from './MonthChart';

export const DischargesCard = () => {

    const selection = useSelector( state => state.flux );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysFlux(selection) && !selection.levelChange){
                    fetchFlux('api/flux/cards/discharges', selection, setIsFetching, setData);
            }
        }

    },
    [selection, delay]);
    
    if (!data){
        return(
        <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: "1rem" }} elevation={3}>
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            </Paper>
        </Grid>
        )
    }else{
        return(
        <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: "1rem", opacity: isFetching ? 0.5: 1, transition: 'opacity 0.4s'}} elevation={3}>
                <Typography sx={{textAlign: 'center'}}>{selection.metric === "% Altas de otras CCAA" ? "Altas de otras CCAA" : "Altas de otra provincia"}</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center'}}>{prettifyInt(data.reduce( (acc, obj) => { return acc + (+obj.num) }, 0 ))}</Typography>
                <Typography color='text.secondary' sx={{fontSize: '1.2rem', textAlign: 'center'}}>{ prettifyNumber(roundTo((data.reduce( (acc, obj) => { return acc + (+obj.num) }, 0 ) / data.reduce( (acc, obj) => { return acc + (+obj.den) }, 0 ))*100, 2))}% sobre altas totales</Typography>
                <Box>
                    <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                </Box>
                <MonthChart data={data} /> 
            </Paper>
        </Grid>
        )
    }
}