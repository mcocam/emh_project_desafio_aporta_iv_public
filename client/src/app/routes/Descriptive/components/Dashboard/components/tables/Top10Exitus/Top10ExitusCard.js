import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../../functions/checkEmptyArrays';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box} from '@mui/material';
import { useSelector } from 'react-redux';
import { fetchData } from '../../../../../../../functions/fetchData';
import { Top10ExitusTable } from './Top10ExitusTable';


export const Top10ExitusCard = () => {
    const selection = useSelector( state => state.descriptive );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchData('api/descriptive/top10exitus', selection, setIsFetching, setData);
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
            <Typography sx={{textAlign: 'center', marginBottom: '0.5rem'}}>Top 10 CCSR según % de exitus</Typography>
            <Top10ExitusTable data={data}/>
            </Paper>
        </Grid>
        )
    }


}