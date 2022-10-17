import {useState, useEffect} from 'react';
import { checkEmptyArraysKpi } from '../../../../../../../functions/checkEmptyArraysKpi';
import { checkNullObject } from '../../../../../../../functions/checkNullObject';
import { Grid, Paper, Typography, CircularProgress, Box} from '@mui/material';
import { useSelector } from 'react-redux';
import { fetchDataKpi } from '../../../../../../../functions/fetchDataKpi';
import { TopLosTable } from './TopLosTable';


export const TopLosCard = () => {
    const selection = useSelector( state => state.kpi );
    const [data, setData] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {
        
        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysKpi(selection) && !selection.levelChange){
                fetchDataKpi('api/kpi/toplos', selection, setIsFetching, setData);
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
            <Typography sx={{textAlign: 'center', fontWeight: 'bold'}}>Top CCSR estancia media (días)</Typography>
            <Typography sx={{textAlign: 'center', marginBottom: '0.5rem', fontSize:'0.8rem'}}>Ratio significativamente por encima de 1</Typography>
            <TopLosTable data={data}/>
            </Paper>
        </Grid>
        )
    }


}