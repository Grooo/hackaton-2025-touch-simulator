export function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth || 0;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

export function drawRadialGradient(ctx, x, y, radius1, fill1, radius2, fill2 ) {
    let gradient = ctx.createRadialGradient(x, y, radius1, x, y, radius2 );
    // -
    gradient.addColorStop( 0.4,  fill1 );
    gradient.addColorStop( 1, fill2 );
    // -
    ctx.fillStyle = gradient;
    ctx.fillRect( x-radius2, y-radius2, radius2*2, radius2*2 );
}

export function drawCurvePath(ctx, pts, _tension, _isClosed, _numOfSegments, _showPoints) {
    // -
    let tension         = _tension          || 0.5;
    let isClosed        = _isClosed         || false;
    let numOfSegments   = _numOfSegments    || 16;
    let showPoints      = _showPoints       || false;
    // -
    ctx.beginPath();
    // -
    drawLines(ctx, getCurvePoints(pts, tension, isClosed, numOfSegments));
    // -
    if (showPoints) {
        ctx.stroke();
        ctx.beginPath();
        // -
        for( let i=0; i<pts.length-1; i+=2 ){
            ctx.rect(pts[i]-2, pts[i+1]-2, 4, 4);
        }
    }
    // -
    ctx.fill();
}

export function getCurvePoints(pts, _tension, _isClosed, _numOfSegments) {
    // - Use input value if provided, or use a default value   
    let tension         = _tension          || 0.5;
    let isClosed        = _isClosed         || false;
    let numOfSegments   = _numOfSegments    || 16;

    let _pts = [], res = [],// clone array
        x, y,               // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;           // steps based on num. of segments

    // clone array so we don't change the original
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if ( isClosed ) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    
    }else{
        _pts.unshift(pts[1]);           //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);
        }
    }
    return res;
}

export function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    // -
    for(let i=2; i<pts.length-1; i+=2){
        ctx.lineTo(pts[i], pts[i+1]);
    }
}