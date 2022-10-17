import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress, Box, Divider, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import {roundTo} from 'round-to';
import roundedSum from '../../../../functions/roundedSum';
import axios from "axios";
import prettifyNumber from '../../../../functions/prettifyNumber';
import { MonthSeries } from './MonthSeries';

const TotalDischargesCard = ({title, metric}) => {

    const maxYear = useSelector( (state) => state.catalogue.catalogue.max_discharge_year );
    const [plotData, setPlotData] = useState();
    const [lastDischarges, setLastDischarges] = useState();
    const [prevDischarges, setPrevDischarges] = useState();
    const [dischargesByType, setDischargesByType] = useState({});
    const [variation, setVariation] = useState();
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async (metric, time) => {
            try{
                const response = await axios.post('/api/homemetrics',{metric: metric, time: time});
                setIsDataFetched(true);
                setPlotData(response.data.timeSeries
                                        .filter(d => d.a === maxYear)
                                        .sort( (a,b) => {
                                            if(a.fecha_alta > b.fecha_alta){
                                                return 1;
                                            } 
                                            if(a.fecha_alta < b.fecha_alta){
                                                return -1;
                                            } 
                                            return 0;
                        } ));
                const lastDischarges = roundedSum(response.data.timeSeries.filter(d => d.a === maxYear).map(d => +d.discharges));
                const prevDischarges = roundedSum(response.data.timeSeries.filter(d => d.a === maxYear-1).map(d => +d.discharges));
                const variation = roundTo(((lastDischarges/prevDischarges)-1)*100, 2);
                setLastDischarges(lastDischarges);
                setPrevDischarges(prevDischarges);
                setVariation(variation);
                setDischargesByType(response.data.dxType);
            }catch(e){
                console.log(e);
            }
    }
        if (maxYear!==undefined && metric!==undefined){
            fetchData(metric, maxYear);
        }

    }, [maxYear,setLastDischarges]);

    if (isDataFetched){
        return(
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ padding: "1rem" }} elevation={3}>
                    <Typography color="text.primary" sx={{fontWeight: "bold"}}>{title}</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 12}}>{maxYear}</Typography>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Typography color="text.primary" align="center" sx={{fontSize: 19}}>{prettifyNumber(lastDischarges)} &nbsp; ({variation > 0 ? '+' + prettifyNumber(variation) : prettifyNumber(variation)}%)</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 14}} align="center">{maxYear-1}: {prettifyNumber(prevDischarges)}&nbsp;</Typography>
                    <Container align="center" sx={{margin: "1rem 0rem"}}>
                        <Box sx={{ justifyContent: 'space-between', display: 'flex', height: "2rem"}}>
                            <Typography sx={{fontSize: 14}}>Ordinarias: <br /> <span style={{fontWeight: 'bold'}}> { dischargesByType.filter(d => d.tipo_dx === 'Ordinario').map(d => prettifyNumber(roundTo(+d.discharges,0) ) ) } </span></Typography>
                            <Typography sx={{fontSize: 14}}>Urgentes: <br /> <span style={{fontWeight: 'bold'}}> { dischargesByType.filter(d => d.tipo_dx === 'Urgente').map(d => prettifyNumber(roundTo(+d.discharges,0) ) ) } </span></Typography>
                        </Box>
                    </Container>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Container maxWidth={false}>
                        <Box>
                            <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                        </Box>
                        <Box height={"6rem"}>
                            <MonthSeries data={plotData}/>
                        </Box>
                    </Container>
                </Paper>
            </Grid>
        )

    }else{
        return(
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ padding: "1rem", backgroundColor: "#F3F8FF"}} elevation={3}>
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                </Paper>
            </Grid>
        )
    }
}

export default TotalDischargesCard;