export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export function deg2Rad(deg){
  return deg * (Math.PI/180)
}

export function rad2deg(rad, absolute){
let deg = rad / (Math.PI/180);
if( absolute && deg < 0 ) deg = 360 + deg;
return deg;
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees){
  let angleInRadians = deg2Rad(angleInDegrees-90);
  return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function polarToCartesianRad(centerX, centerY, radius, angleInRadians){
  let radians = angleInRadians + (Math.PI * 0.5);
  return {
      x: centerX + (radius * Math.cos(radians)),
      y: centerY + (radius * Math.sin(radians))
  };
}

export function distancePoints(pointA, pointB){
  return Math.sqrt( Math.pow( pointB.x - pointA.x, 2 ) + Math.pow( pointB.y - pointA.y, 2 ) );
}

export function cartesianToPolar( pointA, pointB ){
  const distance = distancePoints( pointA, pointB );
  const radians = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
  return { 
    distance, 
    radians: radians + (Math.PI/2)
  };
}

export function pointIsInCircle( circleCenter, circleRadius, p ){
    return ( Math.pow( p.x - circleCenter.x, 2) + Math.pow( p.y - circleCenter.y, 2)) < (Math.pow(circleRadius, 2) );
}

export function rand(min, max){
  return min + (Math.random() * (max-min));
}
export function randFloor(min, max){
return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randDif( _val ){
return (_val * -0.5) + (Math.random()*_val);
}
export function randDirection(){
  return Math.random() > 0.5 ? 1 : -1;
}

export function getPointInBetweenByPerc(pointA, pointB, percentage) {
  let dir = pointB.clone().sub(pointA);
  const len = dir.length();
  dir = dir.normalize().multiplyScalar(len*percentage);
  return pointA.clone().add(dir);
}

export function normalizeRange(value, min, max){
  return (value - min) / (max - min);
}

export function normalizeRangeInOutEase(value, easeFuncIn, easeFuncOut ){
  const easeFunc = value < 0.5 ? easeFuncIn : easeFuncOut || easeFuncIn;
  return easeFunc( value < 0.5 ? value * 2 : ((value-1) * -2) );
}

export function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x*x*(3 - 2*x);
};

export function smootherstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x*x*x*(x*(x*6 - 15) + 10);
};

export function smoothstepInOut (value, rangeIn, rangeOut) {
  return smoothstep(0, rangeIn, value) * (1 - smootherstep( 1-(rangeOut || rangeIn), 1, value));
};
