

const fillMap = (obj, level) => {

    const provinciasModel = [
        { entities: 'Albacete', metric: 0 },
        { entities: 'Alicante/Alacant', metric: 0 },
        { entities: 'Almería', metric: 0 },
        { entities: 'Araba/Álava', metric: 0 },
        { entities: 'Asturias', metric: 0 },
        { entities: 'Ávila', metric: 0 },
        { entities: 'Badajoz', metric: 0 },
        { entities: 'Balears, Illes', metric: 0 },
        { entities: 'Barcelona', metric: 0 },
        { entities: 'Bizkaia', metric: 0 },
        { entities: 'Burgos', metric: 0 },
        { entities: 'Cáceres', metric: 0 },
        { entities: 'Cádiz', metric: 0 },
        { entities: 'Cantabria', metric: 0 },
        { entities: 'Castellón/Castelló', metric: 0 },
        { entities: 'Ceuta', metric: 0 },
        { entities: 'Ciudad Real', metric: 0 },
        { entities: 'Córdoba', metric: 0 },
        { entities: 'Coruña, A', metric: 0 },
        { entities: 'Cuenca', metric: 0 },
        { entities: 'Gipuzkoa', metric: 0 },
        { entities: 'Girona', metric: 0 },
        { entities: 'Granada', metric: 0 },
        { entities: 'Guadalajara', metric: 0 },
        { entities: 'Huelva', metric: 0 },
        { entities: 'Huesca', metric: 0 },
        { entities: 'Jaén', metric: 0 },
        { entities: 'León', metric: 0 },
        { entities: 'Lleida', metric: 0 },
        { entities: 'Lugo', metric: 0 },
        { entities: 'Madrid', metric: 0 },
        { entities: 'Málaga', metric: 0 },
        { entities: 'Melilla', metric: 0 },
        { entities: 'Murcia', metric: 0 },
        { entities: 'Navarra', metric: 0 },
        { entities: 'Ourense', metric: 0 },
        { entities: 'Palencia', metric: 0 },
        { entities: 'Palmas, Las', metric: 0 },
        { entities: 'Pontevedra', metric: 0 },
        { entities: 'Rioja, La', metric: 0 },
        { entities: 'Salamanca', metric: 0 },
        { entities: 'Santa Cruz de Tenerife', metric: 0 },
        { entities: 'Segovia', metric: 0 },
        { entities: 'Sevilla', metric: 0 },
        { entities: 'Soria', metric: 0 },
        { entities: 'Tarragona', metric: 0 },
        { entities: 'Teruel', metric: 0 },
        { entities: 'Toledo', metric: 0 },
        { entities: 'Valencia/València', metric: 0 },
        { entities: 'Valladolid', metric: 0 },
        { entities: 'Zamora', metric: 0 },
        { entities: 'Zaragoza', metric: 0 }
    ];
    const ccaaModel = [
        { entities: 'Andalucía', metric: 0 },
        { entities: 'Aragón', metric: 0 },
        { entities: 'Asturias, Principado de', metric: 0 },
        { entities: 'Balears, Illes', metric: 0 },
        { entities: 'Canarias', metric: 0 },
        { entities: 'Cantabria', metric: 0 },
        { entities: 'Castilla-La Mancha', metric: 0 },
        { entities: 'Castilla y León', metric: 0 },
        { entities: 'Catalunya', metric: 0 },
        { entities: 'Ceuta', metric: 0 },
        { entities: 'Comunitat Valenciana', metric: 0 },
        { entities: 'Extremadura', metric: 0 },
        { entities: 'Galicia', metric: 0 },
        { entities: 'Madrid, Comunidad de', metric: 0 },
        { entities: 'Melilla', metric: 0 },
        { entities: 'Murcia, Región de', metric: 0 },
        { entities: 'Navarra, Comunidad Foral de', metric: 0 },
        { entities: 'País Vasco', metric: 0 },
        { entities: 'Rioja, La', metric: 0 }
      ]

    let filledData = [];

    if (level === "Provincias"){
        filledData = provinciasModel.map(d => {

            const selectedEntity = obj.filter(f => f.entities === d.entities);

            if (selectedEntity.length > 0){
                d.metric = +selectedEntity[0].metric;
            }
            return d;
        });

    }else{

        filledData = ccaaModel.map(d => {

            const selectedEntity = obj.filter(f => f.entities === d.entities);
            if (selectedEntity.length > 0){
                d.metric = +selectedEntity[0].metric
            }
            return d;
        });

    }

    return filledData;

}

module.exports = fillMap;