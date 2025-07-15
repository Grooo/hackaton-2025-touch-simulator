export const DEG_IN_METERS = {
    lat: 110574.61087757687,
    lng: 111302.61697430261
}


export function getDistanceFromLatLngInKm(lat1,lon1, lat2,lon2, decimals ) {
    const R = 6378.137; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d.toFixed( decimals );
}

export function getDistanceInString( _dist ){
    let dist = '';
    if( _dist < 1.0 ){ // Meters
        dist = `${Number(_dist*1000).toFixed(0)}m`
    }else{
        dist = `${Number(_dist).toFixed(1)}km` 
    }
    return dist;
}