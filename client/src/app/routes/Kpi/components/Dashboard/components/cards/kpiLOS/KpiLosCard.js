import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { checkNullObject } from "../../../../../../../functions/checkNullObject";
import { checkEmptyArraysKpi } from "../../../../../../../functions/checkEmptyArraysKpi";
import prettifyNumber from "../../../../../../../functions/prettifyNumber";
import { roundTo } from 'round-to';
import { fetchDataKpi } from "../../../../../../../functions/fetchDataKpi";
import { Grid, Paper, Typography, CircularProgress, Box, Container, Divider } from '@mui/material';
import { KpiCardChart } from "./KpiCardChart";

export const KpiLosCard = ({title, apiPath}) => {

    const selection = useSelector( state => state.kpi );
    const { level, modelEntities, year, age, chapters, ccsr } = useSelector( state => state.kpi );
    const { selectedEntity } = useSelector( state => state.kpi );
    const [data, setData] = useState(null);
    const [ratioColor, setRatioColor] = useState(null);
    const [ratioFemaleColor, setRatioFemaleColor] = useState(null);
    const [ratioMaleColor, setRatioMaleColor] = useState(null);
    const [delay, setDelay] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    useEffect( () => {

        setDelay(checkNullObject(selection));

        if (!delay){
            if (!checkEmptyArraysKpi(selection) && !selection.levelChange){ 
                    fetchDataKpi(apiPath, selection, setIsFetching, setData);
            }
        }
    },
    [level, modelEntities, year, age, chapters, ccsr, delay]);

    useEffect( () => {

        if (selectedEntity && data){

            const ci_lower = data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.ci95_lower)[0];
            const ci_upper = data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.ci95_upper)[0];

            const ci_lower_female = data.genderData.filter(d => d.gender === "Mujer" && d.target_entities === selection.selectedEntity).map(d => d.ci95_lower)[0];
            const ci_upper_female = data.genderData.filter(d => d.gender === "Mujer" && d.target_entities === selection.selectedEntity).map(d => d.ci95_upper)[0];
            const ci_lower_male = data.genderData.filter(d => d.gender === "Hombre" && d.target_entities === selection.selectedEntity).map(d => d.ci95_lower)[0];
            const ci_upper_male = data.genderData.filter(d => d.gender === "Hombre" && d.target_entities === selection.selectedEntity).map(d => d.ci95_upper)[0];


            //Global
            if (ci_lower > 1 && ci_upper > 1){
                setRatioColor('#FDB827');
            }else if (ci_lower < 1 && ci_upper < 1){
                setRatioColor('#2F89FC');
            }else{
                setRatioColor('black');
            }

            //Female
            if (ci_lower_female > 1 && ci_upper_female > 1){
                setRatioFemaleColor('#FDB827');
            }else if (ci_lower_female < 1 && ci_upper_female < 1){
                setRatioFemaleColor('#2F89FC');
            }else{
                setRatioFemaleColor('black');
            }

            //Male
            if (ci_lower_male > 1 && ci_upper_male > 1){
                setRatioMaleColor('#FDB827');
            }else if (ci_lower_male < 1 && ci_upper_male < 1){
                setRatioMaleColor('#2F89FC');
            }else{
                setRatioMaleColor('black');
            }

        }
    }, [selectedEntity, data] );

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
                <Typography sx={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>{title}</Typography>
                <Divider sx={{marginLeft: '-1rem', marginRight: '-1rem'}}/>

                <Typography sx={{textAlign: 'center', color: '#252525', marginTop: '1rem', fontSize: '0.8rem'}}>Ratio observados/esperados</Typography>
                <Typography sx={{textAlign: 'center', color: '#252525', fontSize: '0.8rem'}}>(Intervalos de confianza 95%)</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', color: ratioColor }}>{prettifyNumber(roundTo(data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.ratio)[0] || 0,3))}</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '1rem', textAlign: 'center'}}>({prettifyNumber(roundTo(data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.ci95_lower)[0] || 0,3)) + ' - ' +  prettifyNumber(roundTo(data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.ci95_upper)[0] ||0,3))})</Typography>

                <Container align="center" sx={{marginTop: '1rem', marginBottom: '2rem'}}>
                        <Box sx={{ justifyContent: 'space-around', display: 'flex', height: "2rem", alignContent: 'center'}}>
                            <Typography sx={{fontSize: '0.8rem', textAlign: 'center'}}>Hombre: <br /> <Typography component={'span'} sx={{fontWeight: 'bold', color: ratioMaleColor}} >{ prettifyNumber(roundTo(data.genderData.filter(d => d.gender === "Hombre" && d.target_entities === selection.selectedEntity).map(d => d.ratio)[0] || 0,3)) }</Typography></Typography>
                            <Typography sx={{fontSize: '0.8rem', textAlign: 'center'}}>Mujer: <br /> <Typography component={'span'} sx={{fontWeight: 'bold', color: ratioFemaleColor}}>{ prettifyNumber(roundTo(data.genderData.filter(d => d.gender === "Mujer" && d.target_entities === selection.selectedEntity).map(d => d.ratio)[0] || 0 ,3)) }</Typography></Typography>
                        </Box>
                </Container>

                <Typography sx={{textAlign: 'center', color: '#252525', marginTop: '1rem', fontSize: '0.8rem'}}>Estancia media observada/esperada</Typography>
                <Typography sx={{fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center'}}>{prettifyNumber(roundTo(data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.observed_los)[0] || 0,2)) + ' / ' + prettifyNumber(roundTo(data.entitiesData.filter(d => d.target_entities === selection.selectedEntity).map(d => d.expected_los)[0] || 0,2))}</Typography>
                <Box>
                    <Typography color="text.primary" sx={{textAlign: 'center', color: '#252525', marginTop: '1rem', fontSize: '0.8rem'}}>Posición entidad hospitalaria</Typography>
                </Box>

                <KpiCardChart data={data} selectedEntity={selectedEntity}/>
                
            </Paper>
        </Grid>
        )
    }



}