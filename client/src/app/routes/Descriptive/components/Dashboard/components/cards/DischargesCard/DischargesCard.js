import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../../functions/checkEmptyArrays';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { fetchData } from '../../../../../../../functions/fetchData';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import prettifyInt from '../../../../../../../functions/prettifyInt';
import { DischargesMonthlyChart } from './DischargesMonthlyChart';

export const DischargesCard = () => {

    const selection = useSelector( state => state.descriptive );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchData('api/descriptive/dischargescard', selection, setIsFetching, setData);
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
                <Typography sx={{textAlign: 'center'}}>Altas</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center'}}>{prettifyInt(data.reduce( (acc, obj) => { return acc + (+obj.discharges) }, 0 ))}</Typography>
                <Box>
                    <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                </Box>
                <DischargesMonthlyChart data={data}/>
            </Paper>
        </Grid>
        )
    }
}