import { Container, Grid } from "@mui/material";
import { MapCard } from "./components/map/MapCard";
import { FluxPyramidCard } from "./components/pyramid/FluxPyramidCard";
import { TableCard } from "./components/table/TableCard";
import { DischargesCard } from "./components/cards/DischargesCard/DischargesCard";
import { SortedBarsCard } from "./components/cards/positionCard/SortedBarsCard";

const Dashboard = () => {

    return(
        <Container maxWidth={false} sx={{marginBottom: "3rem"}}>
            <Grid container spacing={3}>
                <DischargesCard />
                <SortedBarsCard />
                <FluxPyramidCard />
                <MapCard />
                <TableCard />
            </Grid>
        </Container>
    )
}

export default Dashboard;