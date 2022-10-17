import { useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select, Checkbox, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fluxSetAges } from '../../../../../redux/slices/fluxSlice/fluxSlice';
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

export const AgeSelector = () => {

    const dispatch = useDispatch();

    const ageGroups = useSelector( (state) => state.catalogue.catalogue.age_group );
    const selectedAges = useSelector( (state) => state.flux.age );

    useEffect(()=> {
        dispatch(fluxSetAges(ageGroups));
    }, 
    [ageGroups, dispatch]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
        dispatch(fluxSetAges(selectedAges.length === ageGroups.length ? [] : ageGroups));
            return;
        }
        dispatch(fluxSetAges(event.target.value));
    }

    if (!selectedAges){
        return(
        <Box sx={boxStyles}>
            <FormControl fullWidth>
                <InputLabel id="desc-ages-label"><BeatLoader size={6}/></InputLabel>
                <Select
                    multiple
                    id="desc-entities"
                    labelId="desc-ages-label"
                    label="Edades"
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
            <InputLabel id="desc-ages-label" size="small">Edades</InputLabel>
            <Select
                multiple
                id="desc-ages"
                labelId="desc-ages-label"
                label="Edades"
                onChange={handleChange}
                value={selectedAges}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                size="small"
                >
                <MenuItem value="all">
                    <Checkbox
                        checked={ageGroups.length > 0 && selectedAges.length === ageGroups.length}
                        indeterminate={selectedAges.length > 0 && selectedAges.length < ageGroups.length}
                    />
                    <ListItemText primary="Seleccionar todo" primaryTypographyProps={{fontWeight: 'bold'}} />
                </MenuItem>
                    {ageGroups.map( (d, i) =>  (
                        <MenuItem value={d} key={i}>
                            <Checkbox checked={selectedAges.indexOf(d) > -1} />
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