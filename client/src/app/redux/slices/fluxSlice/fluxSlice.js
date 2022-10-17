import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    level: "Provincias",
    levelChange: false,
    selectedEntity: "Lleida",
    year: null,
    gender: null,
    age: null,
    chapters: null,
    ccsr: null,
    isFetching: false,
    metric: '% Altas de otras CCAA'
}

const fluxSlice = createSlice({
    name: "flux",
    initialState,
    reducers: {
        fluxSetLevel: (state, action) => {
            state.level = action.payload;
            state.levelChange = true;
        },
        fluxSetEntity: (state, action) => {
            state.selectedEntity = action.payload;
            state.levelChange = false;
        },
        fluxSetSelectedYear: (state, action) => {
            state.year = action.payload;
        },
        fluxSetAges: (state, action) => {
            state.age = action.payload;
        },
        fluxSetGender: (state, action) => {
            state.gender = action.payload;
        },
        fluxSetChapters: (state, action) => {
            state.chapters = action.payload;
        },
        fluxSetccsr: (state, action) => {
            state.ccsr = action.payload;
        },
        fluxSetIsFetching: (state, action) => {
            state.isFetching = action.payload;
        },
        fluxSetMetric: (state, action) => {
            state.metric = action.payload;
        }
    }
});

export const { 
    fluxSetLevel,
    fluxSetEntity,
    fluxSetSelectedYear,
    fluxSetAges,
    fluxSetGender,
    fluxSetChapters,
    fluxSetccsr,
    fluxSetMetric
} = fluxSlice.actions;

export default fluxSlice.reducer;