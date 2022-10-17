import {useState, useEffect} from 'react';
import { checkEmptyArrays } from '../../../../../../../functions/checkEmptyArrays';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { fetchData } from '../../../../../../../functions/fetchData';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import prettifyInt from '../../../../../../../functions/prettifyInt';
import { ExitusMonthlyChart } from './ExitusMonthlyChart';
import { roundTo } from 'round-to';
import prettifyNumber from '../../../../../../../functions/prettifyNumber';

export const ExitusCard = () => {

    const selection = useSelector( state => state.descriptive );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArrays(selection) && !selection.levelChange){
                    fetchData('api/descriptive/exituscard', selection, setIsFetching, setData);
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
                <Typography sx={{textAlign: 'center'}}>Exitus</Typography>
                <Grid container alignItems='center' justifyContent="center">
                    <Grid item>
                        <Typography display={'inline'} sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center'}}>
                            {prettifyInt(data.reduce( (acc, obj) => { return acc + obj.exitus }, 0 ))}
                        </Typography>
                        <Typography display={'inline'}>
                        &nbsp;({ prettifyNumber( roundTo( ( data.reduce( (acc, obj) => { return acc + (obj.exitus || 0) }, 0 ) / data.reduce( (acc, obj) => { return acc + obj.discharges }, 0 ) )*100,2 ))+"%" })
                        </Typography>
                    </Grid>
                </Grid>
                <Box>
                    <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                </Box>
                <ExitusMonthlyChart data={data}/>
            </Paper>
        </Grid>
        )
    }
}