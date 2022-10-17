const fillPyramid = require("../functions/fillPyramid");
const getPyramidColors = require("../functions/pyramidColors");


const descPyramid = async (Schema, req, res) => {

    let result = {
        labels: [],
        datasets: []
    };
    
    const selectedCCSR = req.body.ccsr.map(d => d.label);
    const selectedChapters = req.body.chapters.map(d => d.label);

    let levelEmh = 'prov_hosp';
    if (req.body.level === 'Comunidades'){
        levelEmh = 'ccaa_hosp';
    }

    let levelPadron = 'provincia';
    if (req.body.level === 'Comunidades'){
        levelPadron = 'ccaa';
    }

    pyramidExitusQuery = {
        name: `desc-pyramid-${req.body.metric.substring(0,3)}-${levelEmh}`,
        text: `
            SELECT
                c_age_group,
                age_group,
                sexo,
                SUM(f_exitus)/SUM(f) AS metric
            FROM
                emh.emh_cube
            WHERE
                ccsr = ANY($1) 
                AND capitulo_short = ANY($2) 
                AND ${levelEmh} = ANY($3)
                AND aa = $4
                AND sexo = ANY($5)
            GROUP BY
                c_age_group,
                age_group,
                sexo
            ORDER BY
                    c_age_group ASC,
                    sexo DESC
        `,
    values: [ 
        selectedCCSR,
        selectedChapters,
        req.body.entities,
        req.body.year,
        req.body.gender
        ]
    }

    pyramidAvgQuery = {
        name: `desc-pyramid-${req.body.metric.substring(0,3)}-${levelEmh}`,
        text: `
            SELECT
                c_age_group,
                age_group,
                sexo,
                SUM(dias_estancia)/SUM(f) AS metric
            FROM
                emh.emh_cube
            WHERE
                ccsr = ANY($1) 
                AND capitulo_short = ANY($2) 
                AND ${levelEmh} = ANY($3)
                AND aa = $4
                AND sexo = ANY($5)
            GROUP BY
                c_age_group,
                age_group,
                sexo
            ORDER BY
                c_age_group ASC,
                sexo DESC
        `,
    values: [ 
        selectedCCSR,
        selectedChapters,
        req.body.entities,
        req.body.year,
        req.body.gender
        ]
    }

    pyramidTaxQuery = {
        name: `desc-pyramid-${req.body.metric.substring(0,3)}-${levelEmh}`,
        text: `
            SELECT
                emh.c_age_group,
                emh.age_group,
                emh.sexo,
                (discharges/pob)*100000 AS metric
            FROM
                (
                    SELECT
                        c_age_group,
                        age_group,
                        sexo,
                        SUM(f) AS discharges
                    FROM
                        emh.emh_cube
                    WHERE
                        ccsr = ANY($1) 
                        AND capitulo_short = ANY($2) 
                        AND ${levelEmh} = ANY($3)
                        AND aa = $4
                        AND sexo = ANY($5)
                    GROUP BY
                        c_age_group,
                        age_group,
                        sexo
                ) emh

                LEFT JOIN
                    (
                        SELECT
                            edad_10,
                            sexo,
                            SUM(n_pob) AS pob
                        FROM
                            emh.padron
                        WHERE
                            a = $4
                            AND ${levelPadron} = ANY($3)
                        GROUP BY
                            edad_10,
                            sexo
                    ) padron
                ON emh.age_group = padron.edad_10 AND emh.sexo = padron.sexo
                ORDER BY
                    emh.c_age_group ASC,
                    emh.sexo DESC
        `,
    values: [ 
        selectedCCSR,
        selectedChapters,
        req.body.entities,
        req.body.year,
        req.body.gender
        ]
    }

    let pyramidQuery;

    switch(req.body.metric){
        case 'Tasa bruta de morbilidad (100k habitantes)':
            pyramidQuery = pyramidTaxQuery;
            break;
        case 'Estancia media (días)':
            pyramidQuery = pyramidAvgQuery;
            break;
        case '% de exitus (sobre altas)':
            pyramidQuery = pyramidExitusQuery;
            break;
    }

    try{

        const response = await Schema
                                    .query(pyramidQuery);

        const pyramidSeries = fillPyramid(response.rows, req.body.metric);
        const femaleSeries = pyramidSeries.filter(d => d.sexo === "Mujer");
        const maleSeries = pyramidSeries.filter(d => d.sexo === "Hombre");

        const femaleColors = getPyramidColors(femaleSeries, req.body.age);
        const maleColors = getPyramidColors(maleSeries, req.body.age);

        const labels = femaleSeries.map(d => d.age_group);

        const femaleDataset = {
            label: "Mujer",
            data: femaleSeries.map(d => d.metric),
            backgroundColor: femaleColors.fillColor,
            borderColor: femaleColors.borderColor,
            borderWidth: 1
        }

        const maleDataset = {
            label: "Hombre",
            data: maleSeries.map(d => -d.metric),
            backgroundColor: maleColors.fillColor,
            borderColor: maleColors.borderColor,
            borderWidth: 2
        }

        result.labels = labels;
        result.datasets.push(femaleDataset);
        result.datasets.push(maleDataset);

        res.send(result);

    }catch(e){ 
        console.log(e) 
    }

}

module.exports = descPyramid;