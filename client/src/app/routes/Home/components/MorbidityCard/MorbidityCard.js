import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress, Box, Divider, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import {roundTo} from 'round-to';
import axios from "axios";
import prettifyNumber from '../../../../functions/prettifyNumber';
import {BarChart} from './BarChart';

const MorbidityCard = ({title, metric}) => {

    const maxYear = useSelector( (state) => state.catalogue.catalogue.max_discharge_year );
    const [plotData, setPlotData] = useState();
    const [last, setLast] = useState(0);
    const [prev, setPrev] = useState(0);
    const [taxBySex, setTaxBySex] = useState(0);
    const [variation, setVariation] = useState(0);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async (metric, time) => {
            const response = await axios.post('/api/homemetrics',{metric: metric, time: time});
            setIsDataFetched(true);
            setPlotData(response.data.top10);
            setPrev(+response.data.tax[0].tax);
            setLast(+response.data.tax[1].tax);
            setTaxBySex(response.data.taxBySex);
            setVariation(roundTo( ((response.data.tax[1].tax/response.data.tax[0].tax)-1)*100, 2) )
        }

        if (maxYear!==undefined && metric!==undefined){
            fetchData(metric, maxYear); 
        }
    },
    
    [maxYear, setPlotData]);

    if (isDataFetched){
        return(
            <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ padding: "1rem" }} elevation={3}>
                    <Typography color="text.primary" sx={{fontWeight: "bold"}}>{title}</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 12}}>{maxYear}</Typography>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Typography color="text.primary" align="center" sx={{fontSize: 19}}>{prettifyNumber(roundTo(last,3))} &nbsp; ({variation > 0 ? '+' + prettifyNumber(variation) : prettifyNumber(variation)}%)</Typography>
                    <Typography color="text.secondary" sx={{fontSize: 14}} align="center">{maxYear-1}: {prettifyNumber(roundTo(prev,3))}&nbsp;</Typography>
                    <Container align="center" sx={{margin: "1rem 0rem"}}>
                        <Box sx={{ justifyContent: 'space-between', display: 'flex', height: "2rem"}}>
                            <Typography sx={{fontSize: 14}}>{taxBySex[0].sexo}: <br /> <span style={{fontWeight: 'bold'}}>{ prettifyNumber(roundTo(+taxBySex[0].tax,3)) }</span></Typography>
                            <Typography sx={{fontSize: 14}}>{taxBySex[1].sexo}: <br /> <span style={{fontWeight: 'bold'}}>{ prettifyNumber(roundTo(+taxBySex[1].tax,3)) }</span></Typography>
                        </Box>
                    </Container>
                    <Divider sx={{margin:"0.5rem -1rem"}}/>
                    <Container maxWidth={false}>
                        <Box>
                            <Typography color="text.primary" sx={{fontSize: 9, fontWeight: 'bold'}}>Top 10 capítulos CIE-10</Typography>
                        </Box>
                        <Box height={"6rem"}>
                            <BarChart data={plotData}/>
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

export default MorbidityCard;