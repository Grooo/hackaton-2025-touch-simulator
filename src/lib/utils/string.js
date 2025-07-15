export function string2Secret( _str ){
    let str = '';
    for(let i=0; i<_str.length; i++){
        str += '*';
    }
    return str;
}

//- Afegeix zeros devant
export function addZeros( n, length ){
    //- Length: Número de xifres que volem que tingui el nou número
    const str = (n > 0 ? n : -n) + "";
    let zeros = "";
    for (let i = length - str.length; i > 0; i--){
        zeros += "0";
    }
    zeros += str;
    return n >= 0 ? zeros : "-" + zeros;
}

// - Esborrar accents
export function cleanUpSpecialChars( _str ){
    return this.replace(/[ÀÁÂÃÄÅ]/g,"A")
    .replace(/[àáâãäå]/g,"a")
    .replace(/[ÈÉÊË]/g,"E")
    .replace(/[èéêë]/g,"e")
    .replace(/[ÌÍÎÏ]/g,"I")
    .replace(/[ìíîï]/g,"i")
    .replace(/[ÒÓÔÕÖ]/g,"O")
    .replace(/[òóôõö]/g,"o")
    .replace(/[ÙÚÛÜ]/g,"U")
    .replace(/[ùúûü]/g,"u")
    .replace(/[Ç]/g,"C")
    .replace(/[ç]/g,"c")
    .replace(/[Ñ]/g,"N")
    .replace(/[ñ]/g,"n");
}
//String.prototype.cleanUpSpecialChars = cleanUpSpecialChars;

export function trim(){
    return this.replace(/(^\s+|\s+$)/g, '');
}
//String.prototype.trim = trim;