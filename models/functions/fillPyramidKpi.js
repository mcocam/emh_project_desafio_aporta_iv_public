

const fillPyramidKpi = (obj, selectedMetric, observedCol, expectedCol) => {

    const model = [
        {
            c_age_group_group: 1,
            age_group: '0 años',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 1,
            age_group: '0 años',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 2,
            age_group: '1 - 9',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 2,
            age_group: '1 - 9',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 3,
            age_group: '10 - 19',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 3,
            age_group: '10 - 19',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 4,
            age_group: '20 - 29',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 4,
            age_group: '20 - 29',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 5,
            age_group: '30 - 39',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 5,
            age_group: '30 - 39',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 6,
            age_group: '40 - 49',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 6,
            age_group: '40 - 49',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 7,
            age_group: '50 - 59',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 7,
            age_group: '50 - 59',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 8,
            age_group: '60 - 69',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 8,
            age_group: '60 - 69',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 9,
            age_group: '70 - 79',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 9,
            age_group: '70 - 79',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 10,
            age_group: '80 - 89',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 10,
            age_group: '80 - 89',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 11,
            age_group: '90+',
            sexo: 'Hombre',
            observed_metric: 0,
            expected_metric: 0
          },
          {
            c_age_group_group: 11,
            age_group: '90+',
            sexo: 'Mujer',
            observed_metric: 0,
            expected_metric: 0
          }
    ]

    const fillSeries = model.map( d => {
        
        const targetObj = obj
                            .filter(t => t.c_age === d.c_age_group_group && t.gender === d.sexo);

        if (targetObj.length > 0){
          if (selectedMetric.includes('%')){
            d.observed_metric = +targetObj[0][observedCol]*100;
            d.expected_metric = +targetObj[0][expectedCol]*100;
          }else{
            d.observed_metric = +targetObj[0][observedCol];
            d.expected_metric = +targetObj[0][expectedCol];
          }
        }

        return d;

    });

    return fillSeries;

}

module.exports = fillPyramidKpi;