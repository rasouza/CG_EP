var Sphere = function() {

    // Material
    this.ambient = vec4(1.0,1.0,1.0,1.0);
    this.diffuse = vec4(0.5,0.8,0.1,1.0);
    this.specular = vec4(1.0,1.0,1.0,1.0);
    gl.uniform4fv(shaderProgram.materialAmbient, this.ambient);
    gl.uniform4fv(shaderProgram.materialDiffuse, this.diffuse);
    gl.uniform4fv(shaderProgram.materialSpecular, this.specular);

    // Polys
	this.vertices = [
        // Frente
         0.0            , 1.0 , 0.0             ,
        -Math.sqrt(0.5) , 0.0 , Math.sqrt(0.5)  ,
         Math.sqrt(0.5) , 0.0 , Math.sqrt(0.5)  ,

        // Direita
         0.0            , 1.0 , 0.0             ,
         Math.sqrt(0.5) , 0.0 ,  Math.sqrt(0.5) ,
         Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        // Trás
         0.0            , 1.0 , 0.0             ,
         Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        -Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        // Esquerda
         0.0            , 1.0 , 0.0             ,
        -Math.sqrt(0.5) , 0.0 , -Math.sqrt(0.5) ,
        -Math.sqrt(0.5) , 0.0 ,  Math.sqrt(0.5) ,

        // Frente
        0.0             , -1.0 , 0.0            ,
       -Math.sqrt(0.5)  ,  0.0 , Math.sqrt(0.5) ,
        Math.sqrt(0.5)  ,  0.0 , Math.sqrt(0.5) ,
        // Direita
        0.0             , -1.0 , 0.0            ,
        Math.sqrt(0.5) ,  0.0 ,  Math.sqrt(0.5) ,
        Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
        // Trás
        0.0             , -1.0 , 0.0            ,
        Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
       -Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
        // Esquerda
        0.0             , -1.0 , 0.0            ,
       -Math.sqrt(0.5) ,  0.0 , -Math.sqrt(0.5) ,
       -Math.sqrt(0.5) ,  0.0 ,  Math.sqrt(0.5)
    ];

    // Texture
    this.texture = [
        // Frente
        0, 0.5,
        1, 0.5,
        0, 1,

        // Direita
        0, 1,
        0, 1,
        0, 1,

        // Trás
        0, 1,
        0, 1,
        0, 1,

        // Esquerda
        0, 1,
        0, 1,
        0, 1,

        // Frente
        0, 1,
        0, 1,
        0, 1,

        // Direita
        0, 1,
        0, 1,
        0, 1,

        // Trás
        0, 1,
        0, 1,
        0, 1,

        // Esquerda
        0, 1,
        0, 1,
        0, 1,
    ];

    this.children = [];

};

Sphere.prototype = new Actor();// determina a heranca
Sphere.prototype.constructor = Sphere;// corrige contrutor para sphere

Sphere.prototype.log = function() {	console.log(this.vertices); };