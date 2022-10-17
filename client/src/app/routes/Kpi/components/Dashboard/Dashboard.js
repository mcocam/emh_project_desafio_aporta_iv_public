import { Container, Grid } from "@mui/material";
import { KpiMorbidityCard } from "./components/cards/kpiMorbidity/KpiMorbidityCard";
import { KpiMortalityCard } from "./components/cards/kpiMortalityCard/KpiMortalityCard";
import { KpiLosCard } from "./components/cards/kpiLOS/KpiLosCard";
import { KpiPyramidCard } from "./components/pyramid/KpiPyramidCard";
import { MapCard } from "./components/maps/MapCard";
import { TopLosCard } from "./components/tables/TopLos/TopLosCard";
import { TopExitusCard } from "./components/tables/TopExitus/TopExitusCard";

export const Dashboard = () => {

    return(
        <Container maxWidth={false} sx={{marginBottom: "3rem"}}>
            <Grid container spacing={3}>
                <KpiMorbidityCard title={"Morbilidad estandarizada (altas)"} apiPath={"api/kpi/morbidity"}/>
                <KpiMortalityCard title={"Mortalidad estandarizada (exitus)"} apiPath={"api/kpi/mortality"}/>
                <KpiLosCard title={"Estancia media estandarizada (días)"} apiPath={"api/kpi/los"}/>
                <KpiPyramidCard />
                <MapCard />
                <TopExitusCard />
                <TopLosCard />
            </Grid>
        </Container>
    )
}