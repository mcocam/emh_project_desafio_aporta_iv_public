import {Box} from '@mui/material';
import Dashboard from './components/Dashboard/Dashboard';
import SideBar from './components/SideBar/SideBar';
import { changeBodyColor } from '../../components/Navbar/navbarStyles';



const Descriptive = () =>{

    changeBodyColor("#F4F4F4");

    return(
        <Box display='flex'>
            <SideBar />
            <Dashboard />
        </ Box>
                
    )
};

export default Descriptive;