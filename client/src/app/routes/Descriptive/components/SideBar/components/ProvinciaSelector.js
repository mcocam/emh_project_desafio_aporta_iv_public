import { useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Checkbox, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { descSetEntities } from '../../../../../redux/slices/descriptiveSlices/descriptiveSlice';
import BeatLoader from 'react-spinners/BeatLoader';
import { boxStyles } from './boxStyles';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
    },
},
    autoFocus: false
};

export const ProvinciaSelector = () => {

    const dispatch = useDispatch();
    const level = useSelector( (state) => state.descriptive.level );
    const entities = useSelector( (state) => state.catalogue.catalogue.prov_hosp );
    const selectedEntities = useSelector( (state) => state.descriptive.entities );

    useEffect( () => {
        dispatch(descSetEntities(entities));
    }
        ,[level, entities, dispatch]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
        dispatch(descSetEntities(selectedEntities.length === entities.length ? [] : entities));
            return;
        }
        dispatch(descSetEntities(event.target.value));
    }

    if (!level || !selectedEntities){

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
                    >
                    </Select>
            </FormControl>
        </Box>
        )
    }else{ 

        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-entities-label" size='small'>Territorio</InputLabel>
                <Select
                    multiple
                    id="desc-entities"
                    labelId="desc-entities-label"
                    label="Territorio"
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