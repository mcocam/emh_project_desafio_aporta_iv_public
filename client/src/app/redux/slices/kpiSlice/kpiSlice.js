import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    level: "Provincias",
    levelChange: false,
    selectedEntity: "Lleida",
    modelEntities: null,
    year: null,
    age: null,
    chapters: null,
    ccsr: null,
    isFetching: false
}

const kpiSlice = createSlice({
    name: "kpi",
    initialState,
    reducers: {
        kpiSetLevel: (state, action) => {
            state.level = action.payload;
            state.levelChange = true;
        },
        kpiSetEntity: (state, action) => {
            state.selectedEntity = action.payload;
            state.levelChange = false;
        },
        kpiSetModelEntities: (state, action) => {
            state.modelEntities = action.payload;
        },
        kpiSetSelectedYear: (state, action) => {
            state.year = action.payload;
        },
        kpiSetAges: (state, action) => {
            state.age = action.payload;
        },
        kpiSetChapters: (state, action) => {
            state.chapters = action.payload;
        },
        kpiSetccsr: (state, action) => {
            state.ccsr = action.payload;
        },
        kpiSetIsFetching: (state, action) => {
            state.isFetching = action.payload;
        }
    }
});

export const { 
    kpiSetLevel,
    kpiSetEntity,
    kpiSetModelEntities,
    kpiSetSelectedYear,
    kpiSetAges,
    kpiSetChapters,
    kpiSetccsr
} = kpiSlice.actions;

export default kpiSlice.reducer;