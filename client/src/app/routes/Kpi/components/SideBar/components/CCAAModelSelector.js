import { useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Checkbox, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { kpiSetModelEntities } from '../../../../../redux/slices/kpiSlice/kpiSlice';
import BeatLoader from 'react-spinners/BeatLoader';
import { boxStyles } from './boxStyles';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  autoFocus: false
};

export const CCAAModelSelector = () => {

    const dispatch = useDispatch();
    const entities = useSelector( (state) => state.catalogue.catalogue.ccaa_hosp );
    const selectedEntities = useSelector( (state) => state.kpi.modelEntities );

    useEffect( () => {
        dispatch(kpiSetModelEntities(entities));
    }
        ,[entities]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
        dispatch(kpiSetModelEntities(selectedEntities.length === entities.length ? [] : entities));
            return;
        }
        dispatch(kpiSetModelEntities(event.target.value));
    }

    if (!entities || !selectedEntities){

        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-entities-label" size='small'><BeatLoader size={6}/></InputLabel>
                <Select
                    multiple
                    id="desc-entities"
                    labelId="desc-entities-label"
                    label="Territorio"
                    value={[]}
                    size="small"
                    >
                    </Select>
            </FormControl>
        </Box>
        )
    }else{ 

        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-entities-label" size='small'>Hospitales modelo (CCAA)</InputLabel>
                <Select
                    multiple
                    id="desc-entities"
                    labelId="desc-entities-label"
                    label="Hospitales modelo (CCAA)"
                    onChange={handleChange}
                    value={selectedEntities}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    size="small"
                    >
                    <MenuItem value="all">
                        <Checkbox
                            checked={entities.length > 0 && selectedEntities.length === entities.length}
                            indeterminate={selectedEntities.length > 0 && selectedEntities.length < entities.length}
                        />
                        <ListItemText primary="Seleccionar todo" primaryTypographyProps={{fontWeight: 'bold'}} />
                    </MenuItem>
                        {entities.map( (d, i) =>  (
                            <MenuItem value={d} key={i}>
                                <Checkbox checked={selectedEntities.indexOf(d) > -1} />
                                <ListItemText primary={d} />
                            </MenuItem>
                            ) 
                        )}
                    </Select>
            </FormControl> 
        </Box>
        )
    
        }
    
}