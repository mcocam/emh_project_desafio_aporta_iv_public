import { useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { descSetSelectedYear } from '../../../../../redux/slices/descriptiveSlices/descriptiveSlice';
import BeatLoader from 'react-spinners/BeatLoader';
import { checkIfFalsy } from '../../../../../functions/chekIfFalsy';
import { boxStyles } from './boxStyles';


export const YearSelector = () => {

    const dispatch = useDispatch();

    const maxYear = useSelector( (state) => state.catalogue.catalogue.max_discharge_year );
    const years = useSelector( (state) => state.catalogue.catalogue.years );
    const selectedYear = useSelector( (state) => state.descriptive.year );

    const handleSelection = (event) => {
        dispatch( descSetSelectedYear(event.target.value) );
    }

    useEffect( () => {
        dispatch( descSetSelectedYear(maxYear) );
    }, [maxYear])

    if ([years, maxYear, selectedYear].some(checkIfFalsy)){
        return (
            <Box sx={boxStyles}>
                <FormControl fullWidth>
                    <InputLabel id="desc-years-label"><BeatLoader size={6}/></InputLabel>
                    <Select
                        id="desc-years"
                        labelId="desc-years-label"
                        value={''}
                        label="Años"
                        size="small"
                        >
                        <MenuItem>''</MenuItem>
                        </Select>
                </FormControl>
            </Box>
        )
    }else{
        return (
            <Box sx={boxStyles}>
                <FormControl fullWidth>
                    <InputLabel id="desc-years-label">Años</InputLabel>
                    <Select
                        id="desc-years"
                        labelId="desc-years-label"
                        value={selectedYear}
                        label="Años"
                        onChange={handleSelection}
                        size="small"
                        >
                            {years.map( (year, i) => <MenuItem value={year} key={i}>{year}</MenuItem> )}
                        </Select>
                </FormControl>
            </Box>
        )
    }
}