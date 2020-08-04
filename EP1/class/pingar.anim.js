// http://klauslaube.com.br/2011/05/16/fazendo-javascript-oo-de-forma-facil.html
var Pingar = function(gdelta = 1) {
    this.passo = -0.1;
    this.time = 0;
};

Pingar.prototype.update = function() {

    this.time += 0.01;
    if(this.time >= 1){
        this.time = 0;
        this.passo = -this.passo;
    }
};