import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    level: "Provincias",
    levelChange: false,
    entities: null,
    year: null,
    gender: null,
    age: null,
    chapters: null,
    ccsr: null,
    isFetching: false
}

const descriptiveSlice = createSlice({
    name: "descriptive",
    initialState,
    reducers: {
        descSetLevel: (state, action) => {
            state.level = action.payload;
            state.levelChange = true;
        },
        descSetEntities: (state, action) => {
            state.entities = action.payload;
            state.levelChange = false;
        },
        descSetSelectedYear: (state, action) => {
            state.year = action.payload;
        },
        descSetGender: (state, action) => {
            state.gender = action.payload;
        },
        descSetAges: (state, action) => {
            state.age = action.payload;
        },
        descSetChapters: (state, action) => {
            state.chapters = action.payload;
        },
        descSetCCSR: (state, action) => {
            state.ccsr = action.payload;
        },
        descSetIsFetching: (state, action) => {
            state.isFetching = action.payload;
        }
    }
});

export const { 
    descSetLevel, 
    descSetEntities, 
    descSetSelectedYear, 
    descSetGender,
    descSetAges,
    descSetChapters,
    descSetCCSR,
    descSetIsFetching
} = descriptiveSlice.actions;

export default descriptiveSlice.reducer;