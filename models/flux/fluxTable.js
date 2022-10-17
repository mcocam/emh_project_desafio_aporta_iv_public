

const fluxTable = async (Schema, req, res) => {

    let result = [];

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

    const tableQueryExtraCCAAId = `flux-ccaa-table-${levelEmh}-${year}`;
    const tableSubQueryExtraCCAAId = `flux-ccaa-subTable-${levelEmh}-${year}`;
    const tableQueryExtraProvId = `flux-prov-table-${levelEmh}-${year}`;
    const tableSubQueryExtraProvId = `flux-prov-subTable-${levelEmh}-${year}`;
    

    let query, subQuery;

    if (metric === '% Altas de otras provincias'){
        query = {
            name: tableQueryExtraProvId,
            text: `SELECT
                        f.entity,
                        f.extra_discharges,
                        f.extra_discharges*100 / f.total_discharges AS extra_percent,
                        f.ordinary_discharges,
                        f.urgent_discharges,
                        f.exitus
                    FROM
                        (SELECT
                            prov_pac AS entity,
                            SUM(f_extra_prov) AS extra_discharges,
                            SUM(f_ordinario) AS ordinary_discharges,
                            SUM(f_urgente) AS urgent_discharges,
                            SUM(f_exitus) AS exitus,
                            (SELECT 
                                SUM(f) 
                            FROM emh.emh_cube 
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
                                AND
                                age_group = ANY($6)
                            ) AS total_discharges
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
                            AND
                            age_group = ANY($6)
                            AND
                            f_extra_prov > 0
                        GROUP BY
                            prov_pac
                        ORDER BY
                            extra_discharges DESC )f`,
            values: [
                year,
                selectedEntity,
                gender,
                selectedCCSR,
                selectedChapters,
                age
            ]
        };

        subQuery = {
            name: tableSubQueryExtraProvId,
            text: `SELECT
                        f.entity,
                        f.ccsr,
                        f.extra_discharges,
                        f.ordinary_discharges,
                        f.urgent_discharges,
                        f.exitus
                    FROM
                        (SELECT
                            prov_pac AS entity,
                            ccsr,
                            SUM(f_extra_prov) AS extra_discharges,
                            SUM(f_ordinario) AS ordinary_discharges,
                            SUM(f_urgente) AS urgent_discharges,
                            SUM(f_exitus) AS exitus
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
                            AND
                            age_group = ANY($6)
                            AND
                            f_extra_prov > 0
                        GROUP BY
                            prov_pac,
                            ccsr
                        ORDER BY
                            prov_pac ASC,
                            extra_discharges DESC )f`,
            values: [
                year,
                selectedEntity,
                gender,
                selectedCCSR,
                selectedChapters,
                age
            ]
        };
    }else{
        query = {
            name: tableQueryExtraCCAAId,
            text: `SELECT
                        f.entity,
                        f.extra_discharges,
                        f.extra_discharges*100 / f.total_discharges AS extra_percent,
                        f.ordinary_discharges,
                        f.urgent_discharges,
                        f.exitus
                    FROM
                        (SELECT
                            ccaa_pac AS entity,
                            SUM(f_extra_ccaa) AS extra_discharges,
                            SUM(f_ordinario) AS ordinary_discharges,
                            SUM(f_urgente) AS urgent_discharges,
                            SUM(f_exitus) AS exitus,
                            (SELECT 
                                SUM(f) 
                            FROM emh.emh_cube 
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
                                AND
                                age_group = ANY($6)
                            ) AS total_discharges
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
                            AND
                            age_group = ANY($6)
                            AND
                            f_extra_ccaa > 0
                        GROUP BY
                            ccaa_pac
                        ORDER BY
                            extra_discharges DESC )f`,
            values: [
                year,
                selectedEntity,
                gender,
                selectedCCSR,
                selectedChapters,
                age
            ]
        };

        subQuery = {
            name: tableSubQueryExtraCCAAId,
            text: `SELECT
                        f.entity,
                        f.ccsr,
                        f.extra_discharges,
                        f.ordinary_discharges,
                        f.urgent_discharges,
                        f.exitus
                    FROM
                        (SELECT
                            ccaa_pac AS entity,
                            ccsr,
                            SUM(f_extra_ccaa) AS extra_discharges,
                            SUM(f_ordinario) AS ordinary_discharges,
                            SUM(f_urgente) AS urgent_discharges,
                            SUM(f_exitus) AS exitus
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
                            AND
                            age_group = ANY($6)
                            AND
                            f_extra_ccaa > 0
                        GROUP BY
                            ccaa_pac,
                            ccsr
                        ORDER BY
                            ccaa_pac ASC,
                            extra_discharges DESC )f`,
            values: [
                year,
                selectedEntity,
                gender,
                selectedCCSR,
                selectedChapters,
                age
            ]
        };
    }

    try{

        const entityData = await Schema.query(query);
        const ccsrData = await Schema.query(subQuery);

        result = entityData.rows;
        const ccsr = ccsrData.rows;

        result.forEach((e, i) => {
            const key = e.entity;

            const data = ccsr.filter(f => f.entity === key);

            result[i].ccsrList = data.slice(0,11);
        });

        res.send(result);

    }catch(e){
        console.log(e);
        res.end();
    }

}

module.exports = fluxTable;