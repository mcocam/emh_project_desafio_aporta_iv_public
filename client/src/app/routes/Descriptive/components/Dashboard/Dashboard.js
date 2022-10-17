import { Container, Grid } from "@mui/material";
import { DischargesCard } from "./components/cards/DischargesCard/DischargesCard";
import { ExitusCard } from "./components/cards/ExitusCard/ExitusCard";
import { AvgStayCard } from "./components/cards/AvgStayCard/AvgStayCard";
import { MorbidityCard } from "./components/cards/MorbidityCard/MorbidityCard";
import { PopPyramidCard } from "./components/populationPyramid/PopPyramidCard";
import { MapCard } from "./components/map/MapCard";
import { Top10AverageStayCard } from "./components/tables/Top10AverageStay/Top10AverageStayCard";
import { Top10ExitusCard } from "./components/tables/Top10Exitus/Top10ExitusCard";

const Dashboard = () => {

    return(
        <Container maxWidth={false} sx={{marginBottom: "3rem"}}>
            <Grid container spacing={3}>
                <DischargesCard />
                <ExitusCard />
                <AvgStayCard />
                <MorbidityCard />
                <PopPyramidCard />
                <MapCard />
                <Top10AverageStayCard />
                <Top10ExitusCard />
            </Grid>
        </Container>
    )
}

export default Dashboard;