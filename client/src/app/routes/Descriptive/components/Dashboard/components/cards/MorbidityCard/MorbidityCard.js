import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../../functions/checkEmptyArrays';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { MorbiditySeriesChart } from './MorbiditySeriesChart';
import prettifyNumber from '../../../../../../../functions/prettifyNumber';
import { fetchData } from '../../../../../../../functions/fetchData';

export const MorbidityCard = () => {

    const years = useSelector(state => state.catalogue.catalogue.years);
    const selection = useSelector( state => state.descriptive );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchData('api/descriptive/morbiditycard', selection, setIsFetching, setData);
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
                <Typography sx={{textAlign: 'center'}}>Tasa morbilidad</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center'}}>{prettifyNumber(data.morbidity)}</Typography>
                <Box>
                    <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Top 10 CCSR</Typography>
                </Box>
                <MorbiditySeriesChart data={data} selectedYear = {selection.year}/>
            </Paper>
        </Grid>
        )
    }
}