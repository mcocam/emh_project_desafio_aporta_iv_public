// Express vars
const express = require('express');
const path = require('path');

// Body-parser
const bp = require('body-parser');

// CORS & Helmet headers
const cors = require('cors');
const helmet = require('helmet');

// Node Child process
let { PythonShell } = require('python-shell');
PythonShell.defaultOptions = {pythonPath: 'python', encoding: 'utf8'};

//Postgres
const { Pool } = require("pg");
const fs = require("fs");

 // Redux
const getDimensions = require('./models/dimensions/getDimensions');

 //Home
const homeDischarges = require('./models/homeMetrics/homeDischarges');
const homeAvgStay = require('./models/homeMetrics/homeAvgStay');
const homeAvgAge = require('./models/homeMetrics/homeAvgAge');
const homeMorbidity = require('./models/homeMetrics/homeMorbidity');
const homeExitus = require('./models/homeMetrics/homeExitus');

 //Descriptive
const descDischargesCard = require('./models/descriptive/descDischargesCard');
const descExitusCard = require('./models/descriptive/descExitusCard');
const descAvgStayCard = require('./models/descriptive/descAvgStayCard');
const descMorbidityCard = require('./models/descriptive/descMorbidityCard');
const descPyramid = require('./models/descriptive/descPyramid');
const descGetChoropleth = require('./models/descriptive/descGetChoroplete');
const descTop10AverageStay = require('./models/descriptive/descTop10AverageStay');
const descTop10exitus = require('./models/descriptive/descTop10exitus');

 //KPI
const kpiMorbidityCard = require('./models/kpi/kpiMorbidityCard');
const kpiMortalityCard = require('./models/kpi/kpiMortalityCard');
const kpiLosCard = require('./models/kpi/kpiLosCard');
const kpiPyramidMorbidity = require('./models/kpi/kpiPyramidMorbidity');
const kpiPyramidMortality = require('./models/kpi/kpiPyramidMortality');
const kpiPyramidLos = require('./models/kpi/kpiPyramidLos');
const kpiMorbidityMap = require('./models/kpi/kpiMorbidityMap');
const kpiMortalityMap = require('./models/kpi/kpiMortalityMap');
const kpiLosMap = require('./models/kpi/kpiLosMap');
const kpiTableLos = require('./models/kpi/kpiTableLos');
const kpiTableExitus = require('./models/kpi/kpiTableExitus');

 //FLUX
const fluxMap = require('./models/flux/fluxMap');
const fluxPyramid = require('./models/flux/fluxPyramid');
const fluxTable = require('./models/flux/fluxTable');
const fluxDischarges = require('./models/flux/fluxDischarges');
const fluxBars = require('./models/flux/fluxBars');
//////////////////////////////////////////////////////////////////////////

// Environment vars
require('dotenv').config();
const PG_HOST = process.env.PG_HOST;
const PG_USER = process.env.PG_USER;
const PG_DB = process.env.PG_DB;
const PG_PASS = process.env.PG_PASS
const PG_PORT = process.env.PG_PORT

// Express set up
const app = express();
app.use(helmet({
        contentSecurityPolicy: {
        directives: {
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'localhost',
                '*.main-domain.com',
                '*.google.com',
                '*.google.co.in',
                '*.google-analytics.com',
                '*.googlesyndication.com',
                '*.googleapis.com',
                '*.doubleclick.net',
                '*.googletagmanager.com/gtag/*',
                'https://www.googletagmanager.com/gtag/js?id=G-S5QFTRLRN1'
                ],
            defaultSrc: [
            "'self'",
            "'unsafe-inline'",
            'localhost',
            '*.main-domain.com',
            '*.google.com',
            '*.google.co.in',
            '*.google-analytics.com',
            '*.googlesyndication.com',
            '*.googleapis.com',
            '*.doubleclick.net',
             '*.googletagmanager.com/gtag/*',
             'https://www.googletagmanager.com/gtag/js?id=G-S5QFTRLRN1'
            ],
        },
        },
    })
);
app.use(cors());
app.use(bp.json());
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

//Postgres connection
const pgClient = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASS,
    port: PG_PORT,
    allowExitOnIdle: true,
    idleTimeoutMillis: 1,
    max: 50,
    ssl: {
        rejectUnauthorized: true,
        ca: fs
                .readFileSync("./config/eu-north-1-bundle.pem")
                .toString()
    }
});
pgClient.connect(e => {
    if (e) throw e;
    console.log("Postgres connected!");
});

app.get('/api/dimensions/getDimensions', (req, res) => {

    getDimensions(req, res);

} );

app.post('/api/homemetrics', (req, res) => {
    
    const metric = req.body.metric;

    switch(metric){
        case "discharges":
            homeDischarges(pgClient, req, res);
            return;
        case 'stay':
            homeAvgStay(pgClient, req, res);
            return;
        case 'age':
            homeAvgAge(pgClient, req, res);
            return;
        case 'exitus':
            homeExitus(pgClient, req, res);
            return;
        case 'morbidity':
            homeMorbidity(pgClient, req, res);
            return;
        default:
            res.send("Not allowed!");
            return;
    }
} );

app.post('/api/descriptive/dischargescard', (req, res) => {

    descDischargesCard(pgClient, req, res);
    return;
    
} );

app.post('/api/descriptive/exituscard', (req, res) => {
    
    descExitusCard(pgClient, req, res);
    return;
    
} );

app.post('/api/descriptive/avgstaycard', (req, res) => {
    descAvgStayCard(pgClient, req, res);
    return;
    
} );

app.post('/api/descriptive/morbiditycard', (req, res) => {

    descMorbidityCard(pgClient, req, res);
    return;

} );

app.post('/api/descriptive/pyramid', (req, res) => {

    descPyramid(pgClient, req, res);
    return;
} );

app.post('/api/descriptive/map', (req, res) => {

    descGetChoropleth(pgClient, req, res);
    return;

});

app.post('/api/descriptive/top10avgstay', (req, res) => {

    descTop10AverageStay(pgClient, req, res);
    return;

});

app.post('/api/descriptive/top10exitus', (req, res) => {

    descTop10exitus(pgClient, req, res);
    return;

});

// KPI
app.post('/api/kpi/morbidity', async (req,res) => {

    const {modelData, targetData} = await kpiMorbidityCard(pgClient,req);
    const sendData = {
        model_data: modelData,
        target_data: targetData,
        selected_entity: req.body.selectedEntity
    }

    let standarditzationPy = new PythonShell('./py-scripts/kpi/get_standardized_morbidity.py');

    standarditzationPy.send(JSON.stringify(sendData));


    standarditzationPy.on('message', (data) => {
        const response = JSON.parse(data);
        const entities_data = JSON.parse(response.entities_data);
        const gender_data = JSON.parse(response.gender_data);

        const parsedData = {
            entitiesData: entities_data,
            genderData: gender_data
        }
        
        res.send(parsedData);
        res.end();
    });


    standarditzationPy.end( (err,code,signal) => {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
        res.end();
    });


} );

app.post('/api/kpi/mortality', async (req,res) => {


    const mortalityData = await kpiMortalityCard(pgClient,req);

    const mortalitySend = JSON.stringify(mortalityData);

    if (mortalitySend.length > 2 && mortalitySend.length){
        let standarditzationPy = new PythonShell('./py-scripts/kpi/get_standardized_mortality.py');
        standarditzationPy.send(mortalitySend);

        standarditzationPy.on('message', (data) => {
            const response = JSON.parse(data);
            const entities_data = JSON.parse(response.entities_data);
            const gender_data = JSON.parse(response.gender_data);
    
            const parsedData = {
                entitiesData: entities_data,
                genderData: gender_data
            }
            
            res.send(parsedData);
            res.end();
        });
    
    
        standarditzationPy.end( (err,code,signal) => {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            res.end();
        });

    }else{
        const entitiesData = [{
            target_entities: null,
            ratio: null,
            ci95_lower: null,
            ci95_upper: null
        }]
        const genderData = [{
            target_entities: null,
            gender: null,
            ratio: null,
            ci95_lower: null,
            ci95_upper: null
        }]
        const voidResponse = {
            entitiesData: entitiesData,
            genderData: genderData
        }

        res.send(voidResponse);
        res.end();
    }


} );

app.post('/api/kpi/los', async (req,res) => {


    const losData = await kpiLosCard(pgClient,req);

    const losDataSend = JSON.stringify(losData);

    if (losDataSend.length > 2){
        let standarditzationPy = new PythonShell('./py-scripts/kpi/get_standardized_los.py');

        standarditzationPy.send(losDataSend);
    
        standarditzationPy.on('message', (data) => {
            const response = JSON.parse(data);
            const entities_data = JSON.parse(response.entities_data);
            const gender_data = JSON.parse(response.gender_data);
    
            const parsedData = {
                entitiesData: entities_data,
                genderData: gender_data
            }
            
            res.send(parsedData);
            res.end();
        });
    
    
        standarditzationPy.end( (err,code,signal) => {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            res.end();
        });

    }else{
        const entitiesData = [{
            target_entities: null,
            ratio: null,
            ci95_lower: null,
            ci95_upper: null
        }]
        const genderData = [{
            target_entities: null,
            gender: null,
            ratio: null,
            ci95_lower: null,
            ci95_upper: null
        }]
        const voidResponse = {
            entitiesData: entitiesData,
            genderData: genderData
        }

        res.send(voidResponse);
        res.end();
    }

} );

app.post('/api/kpi/pyramid', async (req,res) => {

    const { metric } = req.body;

    if (metric === 'Morbilidad estandarizada (altas)'){

        await kpiPyramidMorbidity(pgClient, req, res);
        return;

    }else if (metric === '% de exitus estandarizados (sobre altas)'){
        await kpiPyramidMortality(pgClient, req, res);
        return;
    }else if (metric === 'Estancia media estandarizada (días)'){
        await kpiPyramidLos(pgClient, req, res);
        return;
    }else{
        res.send("Not allowed!");
        return;
    }

} );

app.post('/api/kpi/map', async (req,res) => {

    const { metric } = req.body;

    if (metric === 'Morbilidad estandarizada (ratio)'){

        await kpiMorbidityMap(pgClient, req, res);
        return;

    }else if (metric === 'Exitus estandarizados (ratio)'){
        await kpiMortalityMap(pgClient, req, res);
        return;
    }else if (metric === 'Estancia media estandarizada (ratio)'){
        await kpiLosMap(pgClient, req, res);
        return;
    }else{
        res.send("Not allowed!");
        return;
    }

} );


app.post('/api/kpi/topexitus', async (req,res) => {

    const data = await kpiTableExitus(pgClient, req);

    if (data.length > 2){

        let standarditzationPy = new PythonShell('./py-scripts/kpi/get_significant_top.py');

        standarditzationPy.send(data);
        
        standarditzationPy.on('message', (data) => {
            const response = JSON.parse(data);
            res.send(response);
            res.end();
        })
    
        standarditzationPy.end( (err,code,signal) => {
            if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
                res.end();
            });
    
        return;

    }else{

        const voidResponse = [
            {
                ccsr: '',
                discharges: 0,
                observed: 0,
                expected: 0
            }
        ]

        res.send(voidResponse);
        res.end();
        return;

    }



} );

app.post('/api/kpi/toplos', async (req,res) => {

    const data = await kpiTableLos(pgClient, req);

    if (data.length > 2){

        let standarditzationPy = new PythonShell('./py-scripts/kpi/get_significant_top.py');

        standarditzationPy.send(data);
        
        standarditzationPy.on('message', (data) => {
            const response = JSON.parse(data);
            res.send(response);
            res.end();
        })
    
        standarditzationPy.end( (err,code,signal) => {
            if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
                res.end();
            });
    
        return;

    }else{

        const voidResponse = [
            {
                ccsr: '',
                discharges: 0,
                observed: 0,
                expected: 0
            }
        ]

        res.send(voidResponse);
        res.end();
        return;

    }
} );


//FLUX
app.post('/api/flux/map', (req, res) => {

    fluxMap(pgClient, req, res);
    return;

});

app.post('/api/flux/pyramid', (req, res) => {

    fluxPyramid(pgClient, req, res);
    return;

});

app.post('/api/flux/table', (req, res) => {

    try{
        fluxTable(pgClient, req, res);
        return;
    }catch(e){
        console.log(e);
        res.end();
    }
});

app.post('/api/flux/cards/discharges', (req, res) => {

    try{
        fluxDischarges(pgClient, req, res);
        return;
    }catch(e){
        console.log(e);
        res.end();
    }
});

app.post('/api/flux/cards/bars', (req, res) => {

    try{
        fluxBars(pgClient, req, res);
        return;
    }catch(e){
        console.log(e);
        res.end();
    }
});

// React client
app.use(express.static(path.resolve(__dirname, 'client/build')));
app.get('*', (req,res) =>{
    res.sendFile(path.resolve(__dirname+'/client/build/index.html'));
});

// Port configuration and set up
const port = process.env.PORT || 3030;
app.listen(port);
