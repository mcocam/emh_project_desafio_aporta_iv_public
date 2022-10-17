import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress, Box, Divider, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import {roundTo} from 'round-to';
import axios from "axios";
import prettifyNumber from '../../../../functions/prettifyNumber';
import {MonthSeries} from './MonthSeries';

const AverageAgeCard = ({title, metric}) => {

    const maxYear = useSelector( (state) => state.catalogue.catalogue.max_discharge_year );
    const [plotData, setPlotData] = useState();
    const [last, setLast] = useState(0);
    const [prev, setPrev] = useState(0);
    const [avgBySex, setAvgBySex] = useState(0);
    const [variation, setVariation] = useState(0);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async (metric, time) => {
            try {
                const response = await axios.post('/api/homemetrics',{metric: metric, time: time});
                setIsDataFetched(true);
                setPlotData(response.data.timeSeries);

                const prev = roundTo(+response.data.avg[0].wage,2);
                setPrev(prev);

                const last = roundTo(+response.data.avg[1].wage,2);
                setLast(last);

                setAvgBySex(response.data.avgBySex );

                setVariation(roundTo(((response.data.avg[1].wage/response.data.avg[0].wage)-1)*100, 2));

            }catch(e){
                console.log(e);
            }
        };

        if (maxYear!==undefined && metric!==undefined){
            fetchData(metric, maxYear);
        }
    },
        [maxYear, setLast])



    if (isDataFetched){
        return(
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ padding: "1rem" }} elevation={3}>
                    <Typography color="text.primary" sx={{fontWeight: "bold"}}>{title}</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 12}}>{maxYear}</Typography>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Typography color="text.primary" align="center" sx={{fontSize: 19}}>{prettifyNumber(last)} &nbsp; ({variation > 0 ? '+' + prettifyNumber(variation) : prettifyNumber(variation)}%)</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 14}} align="center">{maxYear-1}: {prettifyNumber(prev)}&nbsp;</Typography>
                    <Container align="center" sx={{margin: "1rem 0rem"}}>
                        <Box sx={{ justifyContent: 'space-between', display: 'flex', height: "2rem"}}>
                            <Typography sx={{fontSize: 14}}>{avgBySex[0].sexo}: <br /> { prettifyNumber(roundTo(+avgBySex[0].wage,2)) }</Typography>
                            <Typography sx={{fontSize: 14}}>{avgBySex[1].sexo}: <br /> { prettifyNumber(roundTo(+avgBySex[1].wage,2)) }</Typography>
                        </Box>
                    </Container>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Container maxWidth={false}>
                        <Box>
                            <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Meses</Typography>
                        </Box>
                        <Box height={"6rem"}>
                            <MonthSeries data={plotData} />
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

export default AverageAgeCard;