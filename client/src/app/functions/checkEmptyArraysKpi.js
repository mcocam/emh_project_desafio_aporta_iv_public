

export const checkEmptyArraysKpi = (obj) => {
    if (obj.age.length === 0 || obj.ccsr.length === 0 || obj.modelEntities.length === 0 || obj.chapters.length === 0){
        return true;
    }

    return false;
}