// SHADERS
var shader_vs;
var shader_fs;
var shaderProgram;

// CAMERA E CENA 
var uLightPosition = vec3(0.0, 0.0, 1.0);
var camera;

        //=================== tentativa de lidar com a camera ===========
        var pitch = 0;
        var pitchRate = 0;

        var yaw = 0;
        var yawRate = 0;

        var xPos = 0;
        var yPos = 0.4;
        var zPos = 0;

        var speed = 0;
        var joggingAngle = 0;
        //=================== tentativa de lidar com a camera ===========


// CONTROLE DA ANIMACAO
var last = 0;
var deltaTime = 0;

// OBJETOS DA CENA
var objects = [];

// QUANDO O DOCUMENTO ESTIVER PRONTO INICIA O SISTEMA
$(function() {
    loadTextFile("shader-vs.gl", function(textv) {
        shader_vs = textv;
        loadTextFile("shader-fs.gl", function(textf) {
            shader_fs = textf;
            init();
        });
    });
});

// =============================
function Start() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // limpa as cores
    
    // CRIA OS OBJETOS
    var object = new Sphere;
    object.inicializaBuffer();
    object.animation = new Pingar();
    object.inicializaObjeto(0, 3, 0);

    var filho = new Sphere;
    filho.inicializaBuffer();
    filho.animation = new Pingar();
    filho.inicializaObjeto(0, 3, 0);

    var filho2 = new Sphere;
    filho2.inicializaBuffer();
    filho2.animation = new Pingar();
    filho2.inicializaObjeto(0, 3, 0);

    object.children.push(filho);
    object.children.push(filho2);

    objects.push(object);
}

function Update() {
    gl.enable(gl.DEPTH_TEST); // abilita buffer de profundidade
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // limpa o buffer de profundidade
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, flatten(camera.projection)); // atualiza matriz de projeção
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, flatten(camera.view)); // atualiza matriz de visualização



        //=================== tentativa de lidar com a camera ===========
        // vMatrix = mult(vMatrix,rotate(radians(-pitch),[1, 0, 0]));// mat4.rotate(vMatrix, radians(-pitch), [1, 0, 0]);
        // vMatrix = mult(vMatrix,rotate(radians(-yaw),[0, 1, 0]));// mat4.rotate(vMatrix, radians(-yaw), [0, 1, 0]);
        // vMatrix = mult(vMatrix,translate([-xPos, -yPos, -zPos]));// mat4.translate(vMatrix, [-xPos, -yPos, -zPos]);
        //=================== tentativa de lidar com a camera ===========

    //console.log("(speed,yaw,pitch)("+speed+","+yaw+","+pitch+")");


    //  ATUALIZA INFORMAÇÕES SOBRE OS OBJETOS
    for (var i = 0; i < objects.length; i++)
        objects[i].update();
}

function AnimationUpdate() {
    var now = new Date().getTime();

    if (last != 0) { // ignora o primeiro frame
        deltaTime = (now - last) / 1000;

        // ATUALIZA ANIMAÇÃO DO OBJETO
        for (var i = 0; i < objects.length; i++)
            objects[i].animationUpdate(deltaTime);




        //=================== tentativa de lidar com a camera ===========
        if (speed != 0) {
            xPos -= Math.sin(radians(yaw)) * speed * deltaTime;
            zPos -= Math.cos(radians(yaw)) * speed * deltaTime;

            joggingAngle += deltaTime * 0.6; // 0.6 "fiddle factor" -- makes it feel more realistic :-)
            yPos = Math.sin(radians(joggingAngle)) / 20 + 0.4;
        }

        yaw += yawRate * deltaTime;
        pitch += pitchRate * deltaTime;
        //=================== tentativa de lidar com a camera ===========



    }



    last = now;
    Update();
}


// ======================================
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function init() {
    // iniciarGL(); // Definir como um canvas 3D
    iniciarEnv(); // Camera, Luz, Terreno, etc.
    iniciarShaders(); // Obter e processar os Shaders
    Start(); // Definir background e cor do objeto
    tick();
}

function tick() {
    requestAnimFrame(tick);
    AnimationUpdate();
}

function iniciarGL() {
    var canvas = $('#canvas')[0];
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        gl.viewport(0, 0, canvas.width, canvas.height);
    } catch (e) {
        if (!gl) console.log("Não pode inicializar WebGL, desculpe");
    }
}

function iniciarShaders() {
    var vertexShader = getShader(gl, "vs");
    var fragmentShader = getShader(gl, "fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Não pode inicializar shaders");
    }

    gl.useProgram(shaderProgram);

    // Vertex Position
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Normals
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // Light Position
    shaderProgram.lightPosition = gl.getUniformLocation(shaderProgram, "uLightPosition");
    gl.uniform3fv(shaderProgram.lightPosition, uLightPosition);

    // Camera Position
    shaderProgram.cameraPosition = gl.getUniformLocation(shaderProgram, "uCameraPosition");
    gl.uniform3fv(shaderProgram.cameraPosition, camera.position);

    // MVP matrices
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
}

function iniciarEnv() {
    camera = new Camera();
}

function getShader(gl, type) {
    var shaderScript;
    if (type == "fs")
        shaderScript = shader_fs
    else
        shaderScript = shader_vs


    if (!shaderScript) return null;

    var shader;
    if (type == "fs") shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (type == "vs") shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;

    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}