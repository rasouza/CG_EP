var Sphere = function() {
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

    this.children = [];

};
Sphere.prototype = new Actor();// determina a heranca
Sphere.prototype.constructor = Sphere;// corrige contrutor para sphere

Sphere.prototype.log = function() {
	console.log(this.vertices);
};