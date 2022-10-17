import {Container, Box, Typography, Grid, Link, List, ListItem, ListItemText, Divider} from '@mui/material';
import Logo from '../../components/Logo/Logo';
import TotalDischargesCard from './components/TotalDischargesCard/TotalDischargesCard';
import AverageStayCard from './components/AverageStayCard/AverageStayCard';
import ExitusCard from './components/ExitusCard/ExitusCard';
import MorbidityCard from './components/MorbidityCard/MorbidityCard';
//import SampleInfo from './components/Alerts/SampleInfo';

const boxStyle = {
    margin: "2rem 1rem"
}

const Home = () =>{    

    return(
        <>
            
            <Container maxWidth={'lg'} sx={{marginBottom: "3rem"}}>
                <Box>
                    <Grid container direction={'column'} spacing={2}>
                        <Grid item xs={12} textAlign="center">
                            <Typography fontSize={30}>Bienvenido/a a <Logo /> </Typography>
                        </Grid>
                        <Grid item xs={12} textAlign="center">
                            <Typography>Una herramienta web para el análisis de los datos de la <Link target="_blank" href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176778&menu=ultiDatos&idp=1254735573175" underline='hover'>Encuesta de Morbilidad Hospitalaria de España</Link> del Instituto Nacional de Estadística</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={boxStyle}>
                    <Grid container justifyItems="center" spacing={2}>
                        <TotalDischargesCard title="Altas totales" metric="discharges"/>
                        <ExitusCard title = "Exitus (altas)" metric="exitus" />
                        <AverageStayCard title = "Estancia media (días)" metric="stay" />
                        <MorbidityCard title = "Tasa morbilidad (100k hab.)" metric="morbidity"/>
                    </Grid>
                </Box>
                <Box>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="h4">¿Qué es?</Typography>
                            <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                        </Grid>
                        <Grid item>
                            <Typography>
                                ¡Hola! Me llamo <Link target="_blank" href="https://www.linkedin.com/in/marccocamoreno/" underline='hover'>
                                Marc
                                </Link> y <Logo /> es el proyecto que he realizado para el <Link target="_blank" href="https://datos.gob.es/es/desafios-aporta/desafio-aporta-2021" underline='hover'>
                                IV Desafío Aporta
                                </Link>. El proyecto tiene por objetivo ofrecer una
                                herramienta web tipo BI (Business Intelligence) para analizar y visualizar 
                                de forma 
                                rápida, interactiva y amigable los datos de 
                                la Encuesta de Morbilidad Hospitalaria del INE.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Actualmente, el proyecto es un prototipo funcional
                                y minimalista que busca ofrecer una base para ir incorporando
                                nuevos análisis combinando todo lo que ofrece JavaScript a 
                                nivel de tecnología web con todo el poder analítico de Python.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                El uso de tecnologías libres y gratuítas 
                                ha permitido <span style={{fontWeight: 'bold'}}>desarrollar</span> el proyecto a coste 0, compartir
                                el código de forma libre y, además, asegurar la escalabilidad
                                de forma relativamente simple gracias a la modularidad de sus 
                                componentes. A continuación, se exponen las distintas tecnologías
                                detrás del proyecto:
                            </Typography>
                        </Grid>

                        <Grid item>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemText >
                                        · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Frontend</span>: React y Redux </Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText >
                                        · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Backend</span>: Node.js y Python (Heroku)</Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText >
                                        · <Typography display={'inline'}><span style={{fontWeight: 'bold'}}>Base de datos</span>: Postgres (AWS RDS)</Typography>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item>
                            <Typography>
                                El código del proyecto (Frontend y Backend) es libre y se puede
                                consultar desde el enlace de la barra superior y se anima a quien
                                le interese a participar en el desarrollo y mejora del código.
                                Quedan muchas cosas por implementar, arreglar, mejorar, refactorizar, etc.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="h4">¿Qué ofrece?</Typography>
                            <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Básicamente, se juega con 4 indicadores principales:
                            </Typography>
                                <Grid item>
                                    <List dense={true}>
                                        <ListItem>
                                            <ListItemText >
                                                · <Typography display={'inline'}>Número de altas </Typography>
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText >
                                                · <Typography display={'inline'}>Número de exitus hospitalarios (defunciones) </Typography>
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText >
                                                · <Typography display={'inline'}>Estancia media (días) </Typography>
                                            </ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText >
                                                · <Typography display={'inline'}>Tasa de morbilidad u hospitalización (100.000 habitantes) </Typography>
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </Grid>
                        </Grid>
                        <Grid item>
                            <Typography>
                                Dichos indicadores son analizados de forma distinta en los 3 dashboards que se ofrecen:
                            </Typography>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemText >
                                        · <Typography sx={{fontWeight: 'bold'}} display={'inline'}>Descriptivos</Typography>: recuentos e indicadores crudos de actividad.
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        · <Typography sx={{fontWeight: 'bold'}} display={'inline'}>KPI</Typography>: indicadores y tasas estandarizadas apropiadas para la comparación y el benchmarking.
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        · <Typography sx={{fontWeight: 'bold'}} display={'inline'}>Flujos</Typography>: indicadores basados en las altas de pacientes de territorios distintos al del hospital, es decir, o de otras CCAA o de otras provincias.
                                    </ListItemText>
                                </ListItem>
                            </List>
                            <Typography>
                                En el apartado <Link target="_blank" href="/metodologia" underline='hover'>Metodología</Link> puedes encontrar los detalles de cada uno de los indicadores que se presentan.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="h4">¿Qué datos se utilizan?</Typography>
                            <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                        </Grid>
                        <Grid item>
                            <Typography>
                                La fuente principal 
                                es la <Link target="_blank" href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176778&menu=ultiDatos&idp=1254735573175" underline='hover'>Encuesta de Morbilidad Hospitalaria</Link>. 
                                Esta base de datos ofrece información 
                                de las distintas altas de los hospitales 
                                españoles de forma casi desagregada (cada fila de datos
                                dispone de un factor de ponderación). 
                                Según las notas metodológicas del INE,
                                con fecha de hoy (06/07/22), la EMH
                                recoge la información del 95,4% de hospitales,
                                lo que supone el 99,2% del total de altas.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                En su versión de microdatos, que es la que aquí se utiliza, 
                                la EMH ofrece las siguientes variables:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemText>
                                        · Procedencia del enfermo y lugar de atención (provincias).
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        · Mes y año del alta y días de estancia.
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        · Diagnóstico principal (CIE-10MC) y tipo (ordinario o urgente).
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        · Circunstancia del alta (curación, traslado, defunción...).
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Se han utilizado, también, los datos poblacionales del <Link target={'_blank'} underline={'hover'} href={'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177011&menu=resultados&idp=1254734710990'}>Padrón</Link> para la construcción de indicadores
                                y los <Link target={"_blank"} href={'https://eciemaps.mscbs.gob.es/ecieMaps/browser/index_10_mc.html'} underline={'hover'}>catálogos CIE-10</Link> del Ministerio de Sanidad.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Para la agrupación diagnósticas (CCSR, Clinical Classifications Software Refined) y la metodología de los KPI, se han utilizado las herramientas que ofrece <Link target={"_blank"} href={'https://www.ahrq.gov/'} underline={'hover'}>AHRQ</Link>.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Finalmente, se ha utilizado el <Link underline={'hover'} target={'_blank'} href={'http://ics.gencat.cat/ca/assistencia/coneixement-assistencial/Projecte-de-Queralt/'}>Índice de Queralt</Link> para la estratificación del riesgo del diagnóstico principal (en curso).
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Debido a la diversidad de fuentes, 
                                no todos los datos están en español.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography variant="h4">Financiación</Typography>
                            <Divider sx={{marginTop: "1rem", marginRight: "1rem"}}/>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Si bien, como se ha indicado, la fase de desarrollo se ha realizado a coste 0,
                                el despliegue en producción de esta aplicación, que procesa millones de datos,
                                sí requiere de recursos, sobretodo en lo que respecta la base de datos.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Por este motivo, se anima a quien 
                                le resulte interesante la herramienta
                                a realizar un donativo vía el 
                                botón superior derecho en la barra de navegación.
                                ¡Muchas gracias!
                            </Typography>
                        </Grid>

                    </Grid>
                </Box>
            </Container>
    </>
    )
} 

export default Home;