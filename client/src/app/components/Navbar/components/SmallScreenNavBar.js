import {Box, 
    AppBar, 
    Toolbar, 
    Button} from '@mui/material';
import RouteMenu from './RouteMenu';
import { Link } from 'react-router-dom';
import Logo from '../../Logo/Logo';
import ContactMenu from './ContactMenu';
import { appBarStyles, logoButton } from '../navbarStyles';
import { changeBodyColor } from '../navbarStyles';


const SmallScreenNavBar = () => {

    return (

        <Box sx={{display: {xs: "flex", md: "none"} }}>
                <AppBar sx={appBarStyles}>
                    <Toolbar variant="dense">

                    <Box flexGrow={1}>
                        <RouteMenu />
                    </Box>

                    <Box flexGrow={1}>
                        <Button component={Link} to="/" sx={logoButton} disableRipple onClick = {() => changeBodyColor("white")}>
                            <Logo />
                        </Button>
                    </Box>

                    <Box flexGrow={0}>
                        <ContactMenu />
                    </Box>

                    </Toolbar>
                </AppBar>
        </Box>
    );
}

export default SmallScreenNavBar;