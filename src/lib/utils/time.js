import { addZeros } from './string'

// - Converteix de milisegons a data llegible
export function time2obj( _time ){
    const o = {};
    if( _time < 0 ){
        o.negative = true;
       _time *= -1;
    }
    // -
    o.seconds = Math.floor((_time)/1000),
    o.minutes = Math.floor(o.seconds/60),
    o.hours   = Math.floor(o.minutes/60),
    o.days    = Math.floor(o.hours/24)
    //-
    o.hours   = o.hours-(o.days*24);
    o.minutes = o.minutes-(o.days*24*60)-(o.hours*60);
    o.seconds = o.seconds-(o.days*24*60*60)-(o.hours*60*60)-(o.minutes*60);
    //-
    return o;
}

export function timeInHTML(_time, _hours, _seconds ){
    const o = time2obj(_time);
    let str = `<span ${o.negative ? 'class="neg"' : ''}>${o.negative ? '-' : ''}`;
    if(_hours && o.hours > 0 ){
        str += `${addZeros(o.hours, 2)}h<span class="dots2">:</span>`;
    }
    str += `${addZeros(o.minutes, 2)}`;
    if(_seconds){
        str += `<span class="dots2">:</span>${addZeros(o.seconds, 2)}</span>`;
    }
    return str;

}

export function timeInMinutes(_time){
    const o = time2obj(_time);
    let str = `${o.hours > 0 ? o.hours : ''}${o.hours > 0 ? ':' : ''}${o.minutes > 0 ? o.minutes : o.hours > 0 ? '00' : '0'} ${o.hours > 0 ? '' : ''}`;
    return str;
}

export function timeInHours(_time){
    const o = time2obj(_time);
    let str = `${o.hours > 0 ? o.hours : ''}${(o.hours > 0 && o.minutes > 0) ? ':' : ''}${o.minutes > 0 ? o.minutes : ''} ${o.hours > 0 ? ` hor${(o.hours == 1 && o.minutes == 0 ) ? 'a' : 'es'}` : ' minuts'}`;
    return str;
}


export function timeDifference( _date1, _date2 ){
    return Number(_date1) - Number(_date2);
}

export function date2Html(_date){
    const date = new Date(_date);
    return `${addZeros(date.getDate(), 2)}/${addZeros(date.getMonth()+1, 2)}/${date.getFullYear()}`;
}

export function currentTime2Html( _withSeconds){
    const date = new Date();
    let str = `${addZeros(date.getHours(), 2)}:${addZeros(date.getMinutes(), 2)}`;
    if( _withSeconds ) str += `:${addZeros(date.getSeconds(), 2)}`;
    return str;
}

export function dateFormated( _date ){
    return `${_date.getFullYear()}-${addZeros(_date.getMonth()+1, 2)}-${addZeros(_date.getDate(), 2)} ${addZeros(_date.getHours(), 2)}:${addZeros(_date.getMinutes(), 2)}:${addZeros(_date.getSeconds(), 2)}`;
}