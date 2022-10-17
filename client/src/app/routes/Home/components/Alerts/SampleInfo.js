import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Collapse, Grid } from "@mui/material";

const SampleInfo = () => {

    const [open, setOpen] = useState(true)

    return (
        <Box >
        <Collapse in={open}>
                <Alert
                severity="info"
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2}}
                >
                    Va lento? Eso es porque los datos se alojan en una BBDD gratuita. Anímate a hacer una donación para mejorar el rendimiento!
                </Alert>
            
        </Collapse>
        </Box>
    )
}

export default SampleInfo;