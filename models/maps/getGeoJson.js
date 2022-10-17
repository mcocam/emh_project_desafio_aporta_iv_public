const fs = require("fs");
const path = require("path");

const getGeoJson = async (level, req, res) => {

    const ccaaPath = path.resolve('data/ccaa.json');
    const provPath = path.resolve('data/provincias.json');

    try{

        let map = {};

        if (level === "Provincias"){
            map = fs.readFileSync(provPath);
        }else{
            map = fs.readFileSync(ccaaPath);
        }

        res.send(map);

    }catch(e){
        console.log(e);
    }

}

module.exports = getGeoJson;