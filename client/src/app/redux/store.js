import { configureStore } from '@reduxjs/toolkit';
import catalogueReducer from './slices/catalogueSlice/catalogueSlice';
import descriptiveReducer from './slices/descriptiveSlices/descriptiveSlice';
import kpiReducer from './slices/kpiSlice/kpiSlice';
import fluxReducer from './slices/fluxSlice/fluxSlice';

export const store = configureStore({
    reducer: {
        catalogue: catalogueReducer,
        descriptive: descriptiveReducer,
        kpi: kpiReducer,
        flux: fluxReducer
    }
});