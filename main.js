var gl;
var shaderProgram;
var piramideVertexPositionBuffer;
var piramideVertexColorBuffer;


var mMatrix = mat4();
var mMatrixPilha = [];
var pMatrix = mat4();
var vMatrix = mat4();

var rPiramide = 0;

var ultimo = 0;

// Iniciar o ambiente quando a página for carregada
$(function() {
    iniciaWebGL();
});

// Iniciar o ambiente
function iniciaWebGL() {
    var canvas = $('#canvas')[0];
    $(canvas).width(window.innerWidth);
    $(canvas).height(window.innerHeight);
    iniciarGL(canvas); // Definir como um canvas 3D
    iniciarShaders(); // Obter e processar os Shaders
    iniciarBuffers(); // Enviar o triângulo e quadrado na GPU
    iniciarAmbiente(); // Definir background e cor do objeto
    tick();
}

function tick() {
    requestAnimFrame(tick);
    desenharCena();
    animar();
}

function iniciarGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        
        
    }
    catch (e) {
        if (!gl) {
            alert("Não pode inicializar WebGL, desculpe");
        }
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
        alert("Não pode inicializar shaders");
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
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function iniciarBuffers() {
    piramideVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
    var vertices = [
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    piramideVertexPositionBuffer.itemSize = 3;
    piramideVertexPositionBuffer.numItems = vertices.length / 3;

    piramideVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
    var cores = [
        // 1.0, 1.0, 1.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // Direita
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // Trás
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // Esquerda
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,


        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // // Direita
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // // Trás
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // // Esquerda
        // 1.0, 0.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0
        
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cores), gl.STATIC_DRAW);
    piramideVertexColorBuffer.itemSize = 4;
    piramideVertexColorBuffer.numItems = cores.length / 4;


}

function iniciarAmbiente() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}

function desenharCena() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pMatrix = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mMatrix = mat4();
    vMatrix = mat4();

    // Desenhando Triângulo

    mPushMatrix();
    mMatrix = translate([0, 0.0, -7.0]);
    // mMatrix = rotate(rPiramide, [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    //gl.drawArrays(gl.TRIANGLES, 0, piramideVertexPositionBuffer.numItems);// smoof 
    gl.drawArrays(gl.LINE_STRIP, 0, piramideVertexPositionBuffer.numItems); // wireframe

    mPopMatrix();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(pMatrix));
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, flatten(vMatrix));
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, flatten(mMatrix));
}

// o 'var ultimo = 0' está no topo (todos as vars globais estão juntas)
function animar() {
    var agora = new Date().getTime();
    if (ultimo != 0) {
        var diferenca = agora - ultimo;
        rPiramide += ((90 * diferenca) / 1000.0) % 360.0;
    }
    ultimo = agora;
}

function mPushMatrix() {
    var copy = mMatrix.slice();
    mMatrixPilha.push(copy);
}

function mPopMatrix() {
    if (mMatrixPilha.length == 0) {
        throw "inválido popMatrix!";
    }
    mMatrix = mMatrixPilha.pop();
}

function degToRad(graus) {
    return graus * Math.PI / 180;
}