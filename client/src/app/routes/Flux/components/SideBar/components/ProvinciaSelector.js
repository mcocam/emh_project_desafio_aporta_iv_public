import { Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fluxSetEntity } from '../../../../../redux/slices/fluxSlice/fluxSlice';
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

export const ProvinciaSelector = () => {

    const dispatch = useDispatch();
    const entities = useSelector( (state) => state.catalogue.catalogue.prov_hosp );
    const selectedEntity = useSelector( (state) => state.flux.selectedEntity );

    const handleChange = (event) => {
        dispatch(fluxSetEntity(event.target.value));
    }

    if (!selectedEntity || !entities){

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
                    <InputLabel id="desc-entity-label">Provincia</InputLabel>
                    <Select
                        id="desc-entity-label"
                        labelId="desc-entity-label"
                        value={selectedEntity}
                        label="Provincia"
                        onChange={handleChange}
                        MenuProps={MenuProps}
                        size="small"
                        >
                            {entities.map( (entity, i) => <MenuItem value={entity} key={i}>{entity}</MenuItem> )}
                        </Select>
                </FormControl>
            </Box>
        )
    
        }
    
}