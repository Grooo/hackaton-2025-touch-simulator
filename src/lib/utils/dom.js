export function srcx( src, magnitude ){
    return src.replace(/((.*)\.)/gi, `$2-${magnitude}x.`);
}