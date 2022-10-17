import { Box, Drawer, Toolbar, Typography, Divider} from '@mui/material';
import { useSelector } from 'react-redux';
import { LevelSelector } from './components/LevelSelector';
import { ProvinciaSelector } from './components/ProvinciaSelector';
import { CCAASelector } from './components/CCAASelector';
import { CCAAModelSelector } from './components/CCAAModelSelector';
import { YearSelector } from './components/YearSelector';
import { DxChapterSelector } from './components/DxChapterSelector';
import { CCSRSelector } from './components/CCSRSelector';
import { AgeSelector } from './components/AgeSelector';

const LargeDrawer = () => {

    const drawerWidth = 320; 
    const level = useSelector( (state) => state.kpi.level );

    return (
        <Box 
            sx={{ display: {xs: "none", md: "flex"}}}
        >
            <Drawer
                variant="permanent"
                anchor="left"
                BackdropProps={{ invisible: true }}
                open={true}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        zIndex: 3
                    },
                }}
                >

                <Toolbar />

                <Box sx={{padding: '1rem 2rem'}}>

                    <Typography variant = {'h7'} sx={{fontWeight: 'bold', marginTop: '2rem'}}>Temporalidad de las altas</Typography><Divider />
                            <YearSelector />
                            <Toolbar sx={{margin: -3}}/>

                    <Typography variant = {'h7'} sx={{fontWeight: 'bold', marginTop: '2rem'}}>Comparar hospitales de:</Typography><Divider />
                            <LevelSelector />
                            {level === "Provincias" ? <ProvinciaSelector /> : <CCAASelector />}
                            <Toolbar sx={{margin: -3}}/>

                    <Typography variant = {'h7'} sx={{fontWeight: 'bold', marginTop: '2rem'}}>Con los hospitales de:</Typography><Divider />
                            <CCAAModelSelector />
                            <Toolbar sx={{margin: -3}}/>

                    <Typography variant = {'h7'} sx={{fontWeight: 'bold'}}>Características del paciente</Typography><Divider />
                        <AgeSelector />
                        <Toolbar sx={{margin: -3}}/>

                    <Typography variant = {'h7'} sx={{fontWeight: 'bold'}}>Diagnóstico principal</Typography><Divider />
                            <DxChapterSelector />
                            <CCSRSelector />
                            <Toolbar sx={{margin: -3}}/>

                </Box>

            </Drawer>

        </Box>
    );
}

export default LargeDrawer;