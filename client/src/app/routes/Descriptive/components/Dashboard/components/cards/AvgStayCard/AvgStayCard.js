import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../../functions/checkEmptyArrays';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { fetchData } from '../../../../../../../functions/fetchData';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { AvgStayMonthlyChart } from './AvgStayMonthlyChart';
import prettifyNumber from '../../../../../../../functions/prettifyNumber';
import { roundTo } from 'round-to';

export const AvgStayCard = () => {

    const selection = useSelector( state => state.descriptive );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchData('api/descriptive/avgstaycard', selection, setIsFetching, setData);
            }
        }

    },
    [selection, delay]);
    
    if (!data){
        return(
        <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: "1rem" }} elevation={3}>
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            </Paper>
        </Grid>
        )
    }else{
        return(
        <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ padding: "1rem", opacity: isFetching ? 0.5: 1, transition: 'opacity 0.4s'}} elevation={3}>
                <Typography sx={{textAlign: 'center'}}>Estancia media (días)</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center'}}>{prettifyNumber(roundTo(data.avgStay || 0, 2) )}</Typography>
                <Box>
                    <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                </Box>
                <AvgStayMonthlyChart data={data.timeSeries}/>
            </Paper>
        </Grid>
        )
    }
}