var canvas;
var gl;

var points,
	normals,
	squarePoints,
	circlePoints;
	
var model = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
var view = new Float32Array([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -0, -0, -6, 1]);
var projection = new Float32Array([-4.9557562665279695, 0, 0, 0, 0, -4.9557562665279695, 0, 0, 0, 0, -1.002002002002002, -1, 0, 0, -0.20020020020020018, 0]);

var NumTimesToSubdivide = 3;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	/*var p = Math.cos(45*Math.PI/180);
	
    var v = [
		vec3(  0.0, -1.0 , 0.0 ),
		vec3(  p,  0.0,  p ),
        vec3( -p,  0.0,  p ),
        vec3( -p,  0.0, -p ),
        vec3(  p,  0.0, -p ),
		vec3(  0.0, 1.0 , 0.0 )
    ];*/
	
	v = [
		vec3(  0.0, -1.0 , 0.0 ),
		vec3(  1.0,  0.0,  0.0 ),
        vec3(  0.0,  0.0,  1.0 ),
        vec3( -1.0,  0.0,  0.0 ),
        vec3(  0.0,  0.0, -1.0 ),
		vec3(  0.0, 1.0 ,  0.0 )
    ];
	
	var vertices = [
		v[0], v[1], v[2],
		v[0], v[2], v[3],
		v[0], v[3], v[4],
		v[0], v[4], v[1],
		
		v[5], v[1], v[2],
		v[5], v[2], v[3],
		v[5], v[3], v[4],
		v[5], v[4], v[1]
	];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	gl.lineWidth(1.0);
    
    // enable hidden-surface removal
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Create a buffer object, initialize it, and associate it with the
    //  associated attribute variable in our vertex shader
    
	
	var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var uColor = gl.getUniformLocation( program, "color" );
	
	var uModel = gl.getUniformLocation( program, "model" );
	gl.uniformMatrix4fv(uModel,false, model);
	
	var uView = gl.getUniformLocation( program, "view" );
	gl.uniformMatrix4fv(uView,false, view);
	
	var uProjection = gl.getUniformLocation( program, "projection" );
	gl.uniformMatrix4fv(uProjection,false, projection);
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
	//APPROXIMATION	
	divideOcta(vertices, NumTimesToSubdivide);
	gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
	
	gl.uniform4f(uColor, 0.0, 0.2, 0.3, 1.0);
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
	
	//CIRCLE
	/*circlePoints = getCirclePoints(200);
	gl.bufferData( gl.ARRAY_BUFFER, circlePoints, gl.STATIC_DRAW );
	gl.uniform4f(uColor, 1.0, 0.0, 0.0, 1.0);
    gl.drawArrays( gl.LINE_LOOP, 0, circlePoints.length/3 );*/
	
	//SQUARE
	/*squarePoints = flatten(vertices);
	gl.bufferData( gl.ARRAY_BUFFER, squarePoints, gl.STATIC_DRAW );
	gl.uniform4f(uColor, 0.0, 1.0, 0.0, 1.0);
	gl.drawArrays( gl.LINE_LOOP, 0, squarePoints.length/3 );*/
	
};

function getCirclePoints(n){
	var points = [];
	var step = (360/n) * (Math.PI/180);
	for(var i = 0; i < n; i++){
		var x = Math.cos(i*step);
		var y = Math.sin(i*step);
		points.push(x);
		points.push(y);
		points.push(0.0);
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



function triangle( a, b, c )
{
	points.push( a );
    points.push( b );
    points.push( c );

	var n = mix(mix(a,b,0.5),c,1/3);
	
	normals.push( n );
    normals.push( n );
    normals.push( n );
	
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c);
    }
    else {
    
        //bisect the sides
        
        var ab = normalize(mix( a, b, 0.5 ));
        var ac = normalize(mix( a, c, 0.5 ));
        var bc = normalize(mix( b, c, 0.5 ));

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count);
        divideTriangle( c, ac, bc, count);
        divideTriangle( b, bc, ab, count);
		divideTriangle( ac, bc, ab, count);

    }
}

function divideOcta( v, count )
{
	normals = [];
	points = [];
    for(var f = 0; f < 8; f++){
		divideTriangle( v[f*3+0],v[f*3+1],v[f*3+2], count);
    }

}
