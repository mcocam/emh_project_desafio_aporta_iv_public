

const fillPyramidFlux = (obj) => {

    const model = [
        {
            c_age_group: 1,
            age_group: '0 años',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 1,
            age_group: '0 años',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 2,
            age_group: '1 - 9',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 2,
            age_group: '1 - 9',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 3,
            age_group: '10 - 19',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 3,
            age_group: '10 - 19',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 4,
            age_group: '20 - 29',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 4,
            age_group: '20 - 29',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 5,
            age_group: '30 - 39',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 5,
            age_group: '30 - 39',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 6,
            age_group: '40 - 49',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 6,
            age_group: '40 - 49',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 7,
            age_group: '50 - 59',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 7,
            age_group: '50 - 59',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 8,
            age_group: '60 - 69',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 8,
            age_group: '60 - 69',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 9,
            age_group: '70 - 79',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 9,
            age_group: '70 - 79',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 10,
            age_group: '80 - 89',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 10,
            age_group: '80 - 89',
            sexo: 'Mujer',
            metric: 0
          },
          {
            c_age_group: 11,
            age_group: '90+',
            sexo: 'Hombre',
            metric: 0
          },
          {
            c_age_group: 11,
            age_group: '90+',
            sexo: 'Mujer',
            metric: 0
          }
    ]

    const fillSeries = model.map( d => {
        
        const targetObj = obj
                            .filter(t => t.c_age_group === d.c_age_group && t.sexo === d.sexo);

        if (targetObj.length > 0){
          d.metric = +targetObj[0].metric;
        }

        return d;

    });

    return fillSeries;

}

module.exports = fillPyramidFlux;