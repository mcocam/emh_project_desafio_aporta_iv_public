import { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    ListItemIcon} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import linkList from './links';
import { changeBodyColor } from '../navbarStyles';
import MenuIcon from '@mui/icons-material/Menu';

const RouteMenu = () => {

    const [anchorElNav, setAnchorElNav] = useState(null);
    const location = useLocation();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return(
        <>
            <IconButton onClick={handleOpenNavMenu}>
                <MenuIcon sx={{color: "black"}}/>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
                >
                {linkList.map( (link, i) => {

                    const isActive= link.path === location.pathname;
                    return(
                    <MenuItem key={i} 
                        onClick={() => {handleCloseNavMenu();changeBodyColor(link.bgColor)}}
                        component={Link} 
                        to={link.path}>
                        <ListItemIcon >
                            <link.icon sx={{color: "black"}}/>
                        </ListItemIcon>
                        <Typography 
                            textAlign="center"
                            className = { isActive ? 'active-link' : '' }>
                            {link.label}
                        </Typography>
                    </MenuItem>)

                    

                }
                )
                }
            </Menu>
        </>
    )
}

export default RouteMenu;