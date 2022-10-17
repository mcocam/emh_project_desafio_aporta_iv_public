
const getPyramidColors = (obj, selectedAges) => {

    const femaleColorSelected = "rgba(120, 88, 166, 0.6)";
    const femaleColorUnselected = "rgba(120, 88, 166, 0.1)";
    const femaleBorderSelected = "rgba(120, 88, 166, 1)";
    const femaleBorderUnselected = "rgba(120, 88, 166, 0.3)";

    const maleColorSelected = "rgba(55, 226, 213, 0.6)";
    const maleColorUnselected = "rgba(55, 226, 213, 0.1)";
    const maleBorderSelected = "rgba(55, 226, 213, 1)";
    const maleBorderUnselected = "rgba(55, 226, 213, 0.3)";

    let colors = {
        fillColor: [],
        borderColor: []
    }

    obj.map(d => {
        if (d.sexo === "Mujer" && selectedAges.includes(d.age_group)){
            colors.fillColor.push(femaleColorSelected);
            colors.borderColor.push(femaleBorderSelected);
        }
        if (d.sexo === "Mujer" && !selectedAges.includes(d.age_group)){
            colors.fillColor.push(femaleColorUnselected);
            colors.borderColor.push(femaleBorderUnselected);
        }

        if (d.sexo === "Hombre" && selectedAges.includes(d.age_group)){
            colors.fillColor.push(maleColorSelected);
            colors.borderColor.push(maleBorderSelected);
        }
        if (d.sexo === "Hombre" && !selectedAges.includes(d.age_group)){
            colors.fillColor.push(maleColorUnselected);
            colors.borderColor.push(maleBorderUnselected);
        }
    });

    return colors;

}

module.exports = getPyramidColors;