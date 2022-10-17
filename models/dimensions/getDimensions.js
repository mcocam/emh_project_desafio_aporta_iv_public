const fs = require("fs");
const path = require("path");

const getDimensions =  async(req, res) => {

    const cataloguePath = path.resolve("data/catalogue.json");
    
    try{

        // Query dimensions values
        const dimensions = fs.readFileSync(cataloguePath);

        res.send(JSON.parse(dimensions));

    } catch(e) {
        console.log(e);
    }
}

module.exports = getDimensions;