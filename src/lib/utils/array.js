export function path2Array(_pathname){
    let args = _pathname.replace(/#/, '').split('/');
    args = args.filter( (arg) => arg != '' );
    return args;
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function randArray(arr){
    return arr[Math.floor(Math.random()* arr.length)];
}

export function removeFromArray(words, excludeWords){
    let _words = [];
    for( let word of words ){
        if( excludeWords.indexOf(word) === -1 ){
            _words.push(word);
        }
    }
    return _words;
}

export function getArrayIds( _arr ){
    return _arr.map( (item) => item.id );
}

// - Object
export function randObj( _obj ){
    let keys = Object.keys(_obj);
    return _obj[keys[ keys.length * Math.random() << 0]];
}