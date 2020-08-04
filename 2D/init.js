var canvas;
var gl;

var shaderProgram;

// Vertex Shader
var resolutionLocation;
var positionLocation;
var uvMatrixLocation;
var pMatrixLocation;

var uvMatrix = mat4.create();
var pMatrix = mat4.create();

// Fragment Shader
var colorLocation;

var buffer = [];


function initGL() {
    canvas = document.getElementById("webgl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    
}

function createShader(gl, id, type) {
    var shader;
    var shaderSrc = document.getElementById(id);

    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, shaderSrc.text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    
    var fragmentShader = createShader(gl, "fshader", "fragment");
    var vertexShader = createShader(gl, "vshader", "vertex");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    // Linka os parametros do shader
    positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    uvMatrixLocation = gl.getUniformLocation(shaderProgram, "uvMatrix");
    pMatrixLocation = gl.getUniformLocation(shaderProgram, "pMatrix");
    
    gl.enableVertexAttribArray(positionLocation);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { alert("Não foi possível inicializar os shaders"); }
}

function initBuffers() {
    createPoly(setRectangle(400, 10, 70, 100));
    createPoly(setRectangle(50, 50, 100, 100));
    createPoly(setF(200,250));
    createPoly(setF(400,250));
    createPoly(setF(600,250));
}

function draw() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(shaderProgram);
    
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniformMatrix4fv(uvMatrixLocation, false, uvMatrix);
    
    buffer.forEach(function(e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e.buffer);
        gl.vertexAttribPointer(positionLocation, e.vertSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(e.primtype, 0, e.nVerts);
    });
        
}

window.onload = function() {
    initGL();
    initShaders();
    initBuffers();   
    draw();
}

// ---------------------------------------------------------------
// --------------------------- Utils -----------------------------
// ---------------------------------------------------------------

// Fills the buffer with the values that define a rectangle.
function setRectangle(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    return [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ];
}

function setF(x, y) {
    var width = 100;
    var height = 150;
    var thickness = 30;
    return [
        // left column
        x, y,
        x + thickness, y,
        x, y + height,
        x, y + height,
        x + thickness, y,
        x + thickness, y + height,

        // top rung
        x + thickness, y,
        x + width, y,
        x + thickness, y + thickness,
        x + thickness, y + thickness,
        x + width, y,
        x + width, y + thickness,

        // middle rung
        x + thickness, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 2,
        x + thickness, y + thickness * 3,
        x + thickness, y + thickness * 3,
        x + width * 2 / 3, y + thickness * 2,
        x + width * 2 / 3, y + thickness * 3
    ];
}

function createPoly(vertices) {
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var poly = {
        buffer:     vertexBuffer, 
        vertSize:   2, 
        nVerts:     vertices.length/2, 
        primtype:   gl.TRIANGLES
    };
    
    buffer.push(poly);
}

