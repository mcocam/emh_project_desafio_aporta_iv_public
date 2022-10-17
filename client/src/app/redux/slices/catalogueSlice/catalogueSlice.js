import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk
export const fetchCatalogue = createAsyncThunk(
    'catalogue/fetchCatalogue',
    async () => {
        try{
            const response = await axios.get('/api/dimensions/getDimensions');
            const catalogue = {
                ...response.data, 
                covars: [
                            {
                                label: 'Edad',
                                value: 'age_group'
                            },
                            {
                                label: 'Sexo',
                                value: 'sexo'
                            },
                            {
                                label: 'CCSR',
                                value: 'ccsr'
                            }
                        ]}
            return catalogue;
        }catch(e){
            return e.message;
        }
    }
);

// Initial state
const initialState = {
    catalogue: {},
    status: 'idle',
    delay: true
};

// Slice
const dimensionsSlice = createSlice({
    name: 'dimensions',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
            .addCase(fetchCatalogue.pending, (state, action) => {
                state.status = 'pending';
            } )
            .addCase(fetchCatalogue.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.catalogue = action.payload;
                state.delay = false;
            } )
    }
});


export default dimensionsSlice.reducer;