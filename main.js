var gl;
var shaderProgram;

var piramideVertexPositionBuffer;
var piramideVertexColorBuffer;

var mMatrix = mat4();
var pMatrix = mat4();
var vMatrix = mat4();

// Iniciar o ambiente quando a página for carregada
$(function() {
    var canvas = $('#canvas')[0];
    $(canvas).width(window.innerWidth);
    $(canvas).height(window.innerHeight);

    iniciarGL(canvas); // Definir como um canvas 3D
    iniciarShaders(); // Obter e processar os Shaders
    iniciarBuffers(); // Enviar o triângulo e quadrado na GPU
    iniciarAmbiente(); // Definir background e cor do objeto
    tick();
});	

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function tick() {
    requestAnimFrame(tick);
    animar();
}

function iniciarGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;        
    }
    catch (e) {
        if (!gl) console.log("Não pode inicializar WebGL, desculpe");
    }
}

function iniciarShaders() {
    var vertexShader = getShader(gl, "#shader-vs");
    var fragmentShader = getShader(gl, "#shader-fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Não pode inicializar shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");


}

function getShader(gl, id) {
    var shaderScript = $(id)[0];

    if (!shaderScript) return null;

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;

    gl.shaderSource(shader, shaderScript.text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function iniciarBuffers() {
    piramideVertexPositionBuffer = gl.createBuffer();
    piramideVertexPositionBuffer.itemSize = 3;
    piramideVertexPositionBuffer.vertices = [
        // Frente
         0.0 , 1.0 , 0.0  , 
        -1.0 , 0.0 , 1.0  ,
         1.0 , 0.0 , 1.0  ,
        // Direita
         0.0 , 1.0 ,  0.0 ,
         1.0 , 0.0 ,  1.0 ,
         1.0 , 0.0 , -1.0 ,
        // Trás
         0.0 , 1.0 ,  0.0 ,
         1.0 , 0.0 , -1.0 , 
        -1.0 , 0.0 , -1.0 ,
        // Esquerda
         0.0 , 1.0 ,  0.0 , 
        -1.0 , 0.0 , -1.0 , 
        -1.0 , 0.0 ,  1.0 ,


        0.0 , -1.0 , 0.0 , 
       -1.0 ,  0.0 , 1.0 ,
        1.0 ,  0.0 , 1.0 ,
        // Direita
        0.0 , -1.0 ,  0.0 ,
        1.0 ,  0.0 ,  1.0 ,
        1.0 ,  0.0 , -1.0 ,
        // Trás
        0.0 , -1.0 ,  0.0 ,
        1.0 ,  0.0 , -1.0 , 
       -1.0 ,  0.0 , -1.0 ,
        // Esquerda
        0.0 , -1.0 ,  0.0 , 
       -1.0 ,  0.0 , -1.0 , 
       -1.0 ,  0.0 ,  1.0
    ];
    piramideVertexPositionBuffer.numItems = piramideVertexPositionBuffer.vertices.length / 3;
	gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideVertexPositionBuffer.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


    piramideVertexColorBuffer = gl.createBuffer();
    piramideVertexColorBuffer.itemSize = 4;
    piramideVertexColorBuffer.cores = [
        // Frente
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        //DIREITA
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        //TRAZ
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        //ESQUERDA
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];
    piramideVertexColorBuffer.numItems = piramideVertexColorBuffer.cores.length / 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(piramideVertexColorBuffer.cores), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

function iniciarAmbiente() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Posiciona a câmera para visualizar o tetraedro
    pMatrix = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    vMatrix = translate([0, 0.0, -7.0]);
}

function desenharCena() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Envia o MVP para a GPU
    setMatrixUniforms();

    //gl.drawArrays(gl.TRIANGLES, 0, piramideVertexPositionBuffer.numItems);// smooth
    gl.drawArrays(gl.LINE_STRIP, 0, piramideVertexPositionBuffer.numItems); // wireframe

}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, flatten(vMatrix));
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, flatten(mMatrix));
}


var ultimo = 0;
var deltaT = 0;
function animar() {
    var agora = new Date().getTime();
    // Ignora o primeiro frame
    if (ultimo != 0) {
    	deltaT += (agora - ultimo)/1000;

    	pingar();
    }
    ultimo = agora;

    desenharCena();
}

function pingar() {
	var g = [0.0, deltaT, 0.0];
	mMatrix = translate(g);
	console.log(g);
	setMatrixUniforms();
}