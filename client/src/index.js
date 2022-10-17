import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from "react-router-dom";
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
import { fetchCatalogue } from './app/redux/slices/catalogueSlice/catalogueSlice';

store.dispatch(fetchCatalogue());

const theme = createTheme({
    typography: {
        fontFamily: [
            'Lato', 
            'sans-serif'
        ].join(",")
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <ThemeProvider theme={theme}>
            <Router>
                <Provider store={store}>
                    <App />
                </Provider>
            </Router>
        </ThemeProvider>
    </>
);
