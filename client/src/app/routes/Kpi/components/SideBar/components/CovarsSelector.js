import { kpiSetCovars } from "../../../../../redux/slices/kpiSlice/kpiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField, Box } from "@mui/material";
import { useEffect } from "react";
import { boxStyles } from "./boxStyles";


export const CovarsSelector = () => {

    const dispatch = useDispatch();
    const covars = useSelector( state => state.catalogue.catalogue.covars );
    const selectedCovars = useSelector( state => state.kpi.covars );

    useEffect( () => {

        if (covars){
            dispatch(kpiSetCovars(covars));
        }

    }, [covars] )

    const handleChange = (event, newValue) => {

        dispatch(kpiSetCovars(newValue));
    }


    if (selectedCovars){
        return(
        <Box sx={boxStyles}>
            <Autocomplete
                size="small"
                multiple
                id="kpi-covars"
                onChange={handleChange}
                options={covars}
                getOptionLabel={(covar) => covar.label}
                noOptionsText = '--'
                value={selectedCovars}
                filterSelectedOptions
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Variables"
                />
                )}
            />
        </Box>)
    }else{
        return ''
    }



    return ''
}