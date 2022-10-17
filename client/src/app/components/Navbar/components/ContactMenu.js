import { useState } from 'react';
import contactLinks from './contactLinks';
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    ListItemIcon} from '@mui/material';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const ContactMenu = () => {

    const [anchorContactNav, setanchorContactNav] = useState(null);
    const handleOpenContactMenu = (event) => {
        setanchorContactNav(event.currentTarget);
    };

    const handleCloseContactMenu = () => {
        setanchorContactNav(null);
    };

    return(
    <>
        <IconButton onClick={handleOpenContactMenu}>
            <ConnectWithoutContactIcon sx={{color: "black"}}/>
        </IconButton>
        <Menu
            id="contact-appbar"
            anchorEl={anchorContactNav}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorContactNav)}
            onClose={handleCloseContactMenu}
            sx={{
                display: { xs: 'block' },
            }}
            >
            {contactLinks.map((cLink, i) => (
                <MenuItem key={i} 
                    onClick={handleCloseContactMenu}
                    component="a"
                    target={ i>0 ? "_blank" : "" }
                    href={cLink.href}
                    disabled = {cLink.disabled}>
                    <ListItemIcon >
                        <cLink.icon sx={{color: "black"}}/>
                    </ListItemIcon>
                    <Typography 
                        textAlign="center">
                        {cLink.label}
                    </Typography>
                </MenuItem>
            ))}
        </Menu>
    </>
    )
}

export default ContactMenu;