import {Box} from '@mui/material';
import { changeBodyColor } from '../../components/Navbar/navbarStyles';
import { SideBar } from './components/SideBar/SideBar';
import { Dashboard } from './components/Dashboard/Dashboard';

const Kpi = () =>{

    changeBodyColor("#F4F4F4");

    return(
        <Box display='flex'>
            <SideBar />
            <Dashboard />
        </ Box>
    )
}

export default Kpi;