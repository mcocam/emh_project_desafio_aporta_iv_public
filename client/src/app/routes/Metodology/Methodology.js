import {Container, Box, Typography, Grid, Divider, List, ListItem, ListItemText, Link} from '@mui/material';
import { useSelector } from 'react-redux';


const Methodology = () =>{

    const maxYear = useSelector( (state) => state.catalogue.catalogue.max_discharge_year );

    return(
        <Container maxWidth={'md'} sx={{marginBottom: "3rem"}}>
            <Box>
                <Grid container direction="column" spacing={2}>

                    <Grid item>
                        <Typography variant="h4" sx={{color: '#7B113A'}}>Algunas advertencias!</Typography>
                        <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                    </Grid>

                    <Grid item>
                        <Typography >
                            A lo largo del análisis e integración de los datos 
                            se han realizado algunas transformaciones 
                            y se han identificado algunos errores y limitaciones
                            que deben considerarse.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography fontWeight={"bold"}>
                            Transformaciones:
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography>
                            · <span style={{fontWeight: "bold"}}>COVID-19</span>: el código COVID-19 (U07.1) no se 
                            empezó a utilizar hasta mediados del 2020, por 
                            lo que muchas de estas altas para el periodo anterior
                            se encuentran en distintos códigos del capítulo
                            de Enfermedades del aparato respiratorio.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography>
                            También, se ha cambiado la localización del código 
                            en los capítulos: en el CIE-10-ES, el código COVID-19 se 
                            clasifica en el capítulo 'Códigos para propósitos especiales';
                            en la aplicación se ha reclasificado en el capítulo
                            'Enfermedades del aparato respiratorio'.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography fontWeight={"bold"}>
                            Posibles errores:
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography>
                            · <span style={{fontWeight: "bold"}}>Exitus de la Comunitat Valenciana</span>:
                                se ha detectado una cantidad anormalmente baja de exitus
                                notificados en las provincias de la Comunitat Valenciana, 
                                por lo que se excluyen estas áreas en la estandarización
                                del indicador.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="h4">Indicadores crudos</Typography>
                        <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Se presentan los 4 indicadores básicos
                            que se analizan a lo largo de la aplicación y, 
                            de forma automática, en la página de inicio, <span style={{fontWeight: 'bold'}}>siempre van a mostrarse 
                            los datos más recientes</span>.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Actualmente, el período que se muestra es: <span style={{fontWeight: 'bold'}}>{maxYear} vs {maxYear-1}</span>.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Los cálculos -la mayoría muy simples- de cada indicador son los siguientes: 
                        </Typography>
                    </Grid>

                    <Grid item>
                        <List dense={true}>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Altas totales</span>: sumatorio del factor de ponderación f de la EMH </Typography>
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Exitus</span>: sumatorio del factor de ponderación f de la EMH donde el tipo de alta es 3 ('Fallecimiento') </Typography>
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Estancia media</span>: sumatorio de los dias de estancia ponderados por f dividido por el total de altas.</Typography>
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Tasa de morbilidad u hospitalización</span>: sumatorio de altas (f) dividido por la cantidad de habitantes de ese mismo año.</Typography>
                                </ListItemText>
                            </ListItem>


                        </List>
                    </Grid>

                    <Grid item>
                        <Typography variant="h4">KPI: indicadores estandarizados</Typography>
                        <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Los indicadores estandarizados buscan minimizar el efecto
                            de las variables de confusión presentes en los indicadores 
                            (edad, sexo, gravedad del diagnóstico, etc.) y ofrecer un valor
                            relativamente más apto para la comparativa entre distintos territorios.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            En este caso, la estandarización se realiza por método indirecto.
                            Por defecto, en el primer inicio, el modelo de ajuste considera
                            todas las CCAA de España y, según el interés de cada usuario,
                            este puede variarse de forma dinámica para conseguir la 
                            comparación deseada.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Para cada indicador se muestra tanto la ratio entre
                            observado/esperado, como los valores propios de cada componente.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography >
                            Los intervalos de confianza de los ajustes se basan
                            en la distribución de probabilidades ji al cuadrado (X²) y en
                            la fórmula propuesta por <Link target="_blank" href="https://pubmed.ncbi.nlm.nih.gov/2296988/" underline='hover'>Ulm (1990)</Link>.
                        </Typography>
                    </Grid>

                    <Grid item>
                        <List dense={true}>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Morbilidad estandarizada</span>: altas esperadas ajustadas por edad y sexo de la población </Typography>
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}>
                                    <span style={{fontWeight: 'bold'}}>
                                    Exitus estandarizados
                                    </span>: defunciones esperadas ajustadas por edad, 
                                    sexo, CCSR y tipo de ingreso (ordinario/urgente). 
                                    Se excluyen las altas sin diagnóstico y de la Comunitat Valenciana.</Typography>
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <ListItemText >
                                    · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Estancia media estandarizada</span>: en este caso sólo se considera la 
                                    estancia de las altas que hayan finalizado en curación y 
                                    se excluyen aquellos valores extremos por encima 
                                    de Q3+(1,5·IQR) por CCSR. La estandarización se realiza por edad, 
                                    sexo, CCSR y tipo de ingreso (ordinario/urgente). 
                                    Se excluyen las altas sin diagnóstico </Typography>
                                </ListItemText>
                            </ListItem>


                        </List>
                    </Grid>

                </Grid>
            </Box>
        </Container>
    )
};

export default Methodology;