const fillPyramidFlux = require("../functions/fillPyramidFlux");
const getPyramidColors = require("../functions/pyramidColors");

const fluxPyramid = async (Schema, req, res) => {

    let result = {
        labels: [],
        datasets: []
    };

    const {
        level,
        gender,
        year,
        age,
        ccsr,
        chapters,
        selectedEntity,
        metric
            } = req.body;

    const selectedCCSR = ccsr.map(d => d.label);
    const selectedChapters = chapters.map(d => d.label);

    let levelEmh = 'prov_hosp';
    if (level === 'Comunidades'){
        levelEmh = 'ccaa_hosp';
    }

    const pyramidQueryExtraCCAAId = `flux-ccaa-pyramid-${levelEmh}-${year}`;
    const pyramidQueryExtraProvId = `flux-prov-pyramid-${levelEmh}-${year}`;

    const pyramidQueryExtraCCAA = {
        name: pyramidQueryExtraCCAAId,
        text: `
                SELECT
                    t.c_age_group,
                    t.age_group,
                    t.sexo,
                    t.num*100/m.den AS metric	
                FROM
                    (SELECT
                        c_age_group,
                        age_group,
                        sexo,
                        SUM(f_extra_ccaa) AS num
                    FROM
                        emh.emh_cube_flux
                    WHERE
                        aa = $1
                        AND
                        ${levelEmh} = $2
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY
                        c_age_group,
                        age_group,
                        sexo)t
                LEFT JOIN
                    (
                    SELECT
                        c_age_group,
                        sexo,
                        SUM(f) AS den
                    FROM
                        emh.emh_cube
                    WHERE
                        aa = $1
                        AND
                        ${levelEmh} = $2
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY
                        c_age_group,
                        sexo
                    )m
                ON t.c_age_group = m.c_age_group AND t.sexo = m.sexo
                ORDER BY
                    t.c_age_group ASC,
                    t.sexo ASC`,
        values: [
            year,
            selectedEntity,
            gender,
            selectedCCSR,
            selectedChapters
        ]
    }

    const pyramidQueryExtraProv = {
        name: pyramidQueryExtraProvId,
        text: `SELECT
                    t.c_age_group,
                    t.age_group,
                    t.sexo,
                    t.num*100/m.den AS metric	
                FROM
                    (SELECT
                        c_age_group,
                        age_group,
                        sexo,
                        SUM(f_extra_prov) AS num
                    FROM
                        emh.emh_cube_flux
                    WHERE
                        aa = $1
                        AND
                        ${levelEmh} = $2
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY
                        c_age_group,
                        age_group,
                        sexo)t
                LEFT JOIN
                    (
                    SELECT
                        c_age_group,
                        sexo,
                        SUM(f) AS den
                    FROM
                        emh.emh_cube
                    WHERE
                        aa = $1
                        AND
                        ${levelEmh} = $2
                        AND
                        sexo = ANY($3)
                        AND
                        ccsr = ANY($4)
                        AND
                        capitulo_short = ANY($5)
                    GROUP BY
                        c_age_group,
                        sexo
                    )m
                ON t.c_age_group = m.c_age_group AND t.sexo = m.sexo
                ORDER BY
                    t.c_age_group ASC,
                    t.sexo ASC`,
        values: [
            year,
            selectedEntity,
            gender,
            selectedCCSR,
            selectedChapters
        ]
    }

    let query = pyramidQueryExtraCCAA;
    if (metric === '% Altas de otras provincias'){
        query = pyramidQueryExtraProv;
    }


    try{
    
        const response = await Schema.query(query);

        const data = response.rows;

        const filledData = fillPyramidFlux(data);
        const femaleSeries = filledData.filter(d => d.sexo === "Mujer");
        const maleSeries = filledData.filter(d => d.sexo === "Hombre");

        const femaleColors = getPyramidColors(femaleSeries, age);
        const maleColors = getPyramidColors(maleSeries, age);

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
        console.log(e);
    }



}

module.exports = fluxPyramid;