
var canvas;
var gl;

var prop;

var theta = 0.0;
var thetaLoc, dirLoc, colorLoc, propLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
	
	window.addEventListener("resize",resizeListener);
	resizeListener();
	
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vertices = [
        vec2(  0,  1 ),
        vec2(  1,  0 ),
        vec2( -1,  0 )
    ];
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    thetaLoc = gl.getUniformLocation( program, "theta" );
	dirLoc = gl.getUniformLocation( program, "dir" );
	colorLoc = gl.getUniformLocation( program, "color" );
	propLoc = gl.getUniformLocation( program, "prop" );

    render();
};

function resizeListener(){
	var w = window.innerWidth;
	var h = window.innerHeight;
	
	canvas.setAttribute("width",w);
	canvas.setAttribute("height",h);
	
	prop = h/w;
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );
	gl.uniform1f( propLoc, prop );
	
	
	gl.uniform1f( dirLoc, -1.0 );
	gl.uniform3f( colorLoc, 1.0, 1.0, 0.0 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
	
	gl.uniform1f( dirLoc, 1.0 );
	gl.uniform3f( colorLoc, 1.0, 0.0, 0.0 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    window.requestAnimFrame(render);
}
