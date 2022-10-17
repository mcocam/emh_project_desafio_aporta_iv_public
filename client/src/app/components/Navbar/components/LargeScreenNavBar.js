import {Box, 
    AppBar, 
    Toolbar, 
    Button} from '@mui/material';
import linkList from './links';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Logo/Logo';
import ContactMenu from './ContactMenu';
import { appBarStyles, linkStyles, logoButton, changeBodyColor } from '../navbarStyles';


const LargeScreenNavBar = () => {

    const location = useLocation();

    return (
        <Box sx={{display: {xs: "none", md: "flex"}}}>
                <AppBar sx={appBarStyles} position='fixed'>
                    <Toolbar variant="dense">

                    <Box flexGrow={1}>
                        <Button component={Link} to="/" sx={logoButton} disableRipple onClick = {() => changeBodyColor("white")}>
                            <Logo />
                        </Button>
                    </Box>

                    <Box flexGrow={1.1}>
                            { linkList.map( (link, i) => {

                                const isActive = link.path === location.pathname;

                                return(
                                        <Button 
                                            key={i}
                                            sx={linkStyles}
                                            component={Link}
                                            to={link.path}
                                            className = { isActive ? 'active-link' : '' }
                                            onClick = {() => changeBodyColor(link.bgColor)}
                                            >
                                            {link.label}
                                        </Button>
                                )
                            } ) }
                    </Box>

                    <Box flexGrow={0}>
                        <ContactMenu />
                    </Box>

                    </Toolbar>
                </AppBar>
        </Box>
    )

}

export default LargeScreenNavBar;