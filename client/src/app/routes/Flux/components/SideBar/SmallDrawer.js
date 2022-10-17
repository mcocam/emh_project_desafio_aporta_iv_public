import { Box, Toolbar, Divider, Typography, SwipeableDrawer, Fab } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { YearSelector } from './components/YearSelector';
import { LevelSelector } from './components/LevelSelector';
import { ProvinciaSelector } from './components/ProvinciaSelector';
import { CCAASelector } from './components/CCAASelector';
import { GenderSelector } from './components/GenderSelector';
import { AgeSelector } from './components/AgeSelector';
import { DxChapterSelector } from './components/DxChapterSelector';
import { CCSRSelector } from './components/CCSRSelector';
import { MetricSelector } from './components/MetricSelector';

const SmallDrawer = () => {

    const level = useSelector( (state) => state.flux.level );
    const [isOpen, setIsOpen] = useState(false);

    return(
      <Box 
      sx={{ display: {xs: "flex", md: "none"} }}>
        <Box sx={{ position: 'fixed', bottom: 50, right: 50, zIndex: 99999 }}>
          <Fab color="primary" aria-label="filters" size="medium" onClick={() => setIsOpen(!isOpen)}>
            <FilterListIcon />
          </Fab>
        </Box>
      <SwipeableDrawer
          anchor="bottom"
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          ModalProps={{keepMounted: true}}
          swipeAreaWidth={56}
          disableSwipeToOpen={false}
          sx={{
              width: '100%',
              height: '50%',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                  width: '100%',
                  height: '50%',
                  boxSizing: 'border-box',
                  zIndex: 3
              },
          }}
          >
          <Box
          sx={{
            position: "absolute",
            top: -56,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0
          }}
        >
        </Box>

          <Box sx={{padding: '1rem 2rem'}}>

            <Typography variant = {'h7'} sx={{fontWeight: 'bold', marginTop: '2rem'}}>Indicador</Typography><Divider />
                    <MetricSelector />
                    <Toolbar sx={{margin: -3}}/>

            <Typography variant = {'h7'} sx={{fontWeight: 'bold'}}>Temporalidad de las altas</Typography><Divider />
                    <YearSelector />
                    <Toolbar sx={{margin: -3}}/>

            <Typography variant = {'h7'} sx={{fontWeight: 'bold', marginTop: '2rem'}}>Geografía de los hospitales</Typography><Divider />
                <LevelSelector />
                {level === 'Provincias' ? <ProvinciaSelector /> : <CCAASelector />}
                <Toolbar sx={{margin: -3}}/>

            <Typography variant = {'h7'} sx={{fontWeight: 'bold'}}>Características del paciente</Typography><Divider />
                <GenderSelector />
                <AgeSelector />
                <Toolbar sx={{margin: -3}}/>

            <Typography variant = {'h7'} sx={{fontWeight: 'bold'}}>Diagnóstico principal</Typography><Divider />
                <DxChapterSelector />
                <CCSRSelector />
                <Toolbar sx={{margin: -3}}/>

            </Box>

      </SwipeableDrawer>

  </Box>
        );
}

export default SmallDrawer;