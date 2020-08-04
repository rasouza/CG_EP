
var canvas;
var gl;

var points,
	squarePoints,
	circlePoints;

var NumTimesToSubdivide = 3;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	var p = Math.cos(45*Math.PI/180);
	
    var vertices = [
        vec2(  p,  p ),
        vec2( -p,  p ),
        vec2( -p, -p ),
        vec2(  p, -p )
    ];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    // enable hidden-surface removal
    
    //gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
	
	var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
   

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var uColor = gl.getUniformLocation( program, "color" );
	
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
	//APPROXIMATION
	divideSquare(vertices, NumTimesToSubdivide);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	gl.uniform4f(uColor, 0.0, 0.0, 1.0, 1.0);
	gl.drawArrays( gl.LINES, 0, points.length );
	
	//CIRCLE
	circlePoints = getCirclePoints(200);
	gl.bufferData( gl.ARRAY_BUFFER, circlePoints, gl.STATIC_DRAW );
	gl.uniform4f(uColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays( gl.LINE_LOOP, 0, circlePoints.length/2 );
	
	//SQUARE
	/*squarePoints = flatten(vertices);
	gl.bufferData( gl.ARRAY_BUFFER, squarePoints, gl.STATIC_DRAW );
	gl.uniform4f(uColor, 0.0, 1.0, 0.0, 1.0);
	gl.drawArrays( gl.LINE_LOOP, 0, squarePoints.length/2 );*/
	
};

function getCirclePoints(n){
	var points = [];
	var step = (360/n) * (Math.PI/180);
	for(var i = 0; i < n; i++){
		var x = Math.cos(i*step);
		var y = Math.sin(i*step);
		points.push(x);
		points.push(y);
	}
	return new Float32Array(points);
}

function divideSquare(vertices,times){
	points=[];
	divideLine(vertices[0],vertices[1],NumTimesToSubdivide);
	divideLine(vertices[1],vertices[2],NumTimesToSubdivide);
	divideLine(vertices[2],vertices[3],NumTimesToSubdivide);
	divideLine(vertices[3],vertices[0],NumTimesToSubdivide);
}


function addLines(a,b){
	points.push(a);
	points.push(b);
}

function divideLine( a, b, count){
	if ( count === 0 ) {
        addLines( a, b );
    }
    else {
		var ab = normalize(mix( a, b, 0.5));
		count--;
		divideLine( a, ab, count);
		divideLine( b, ab, count);
	}
}



function triangle( a, b, c, color )
{
    // add colors and vertices for one triangle

    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 1.0, 0.0)
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );

}

function divideTriangle( a, b, c, count, color )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c, color );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count, color );
        divideTriangle( c, ac, bc, count, color );
        divideTriangle( b, bc, ab, count, color );

    }
}

function tetra( a, b, c, d, count )
{
    // tetrahedron with each side using
    // a different color
    
    divideTriangle( a, b, c, count, 0);
    divideTriangle( a, c, d, count, 1);
    divideTriangle( a, d, b, count, 2);
    divideTriangle( b, c, d, count, 3);

}
