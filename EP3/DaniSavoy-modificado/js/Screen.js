var Screen = function(id){
	this.id = id
	this.canvas;
	this.gl;
	this.program;
	this.volume = new Volume();
	this.toSpace = function(x,y){return this.volume.toSpace(x,y)}
}

var Volume = function(){
	this.restore = function(){
		this.xleft = -1.0;
		this.xright = 1.0;
		this.ybottom = -1.0;
		this.ytop = 1.0;
		this.znear = -1.0;
		this.zfar = 1.0;
		this.ratio = 1;
		this.w = 1;
		this.h = 1;
		this.min = 1;
	}
	
	this.update = function(w,h){
		this.restore();
		this.w = w;
		this.h = h;
		this.ratio = w/h;
		
		this.xleft = this.ybottom * this.ratio;
		this.xright = this.ytop * this.ratio;
		
		this.min = Math.min(this.ytop,this.xright);
		this.ybottom/=this.min;
		this.ytop/=this.min;
		this.xright/=this.min;
		this.xleft/=this.min;
	}
	
	this.getProjection = function(){
		return ortho(this.xleft, this.xright, this.ybottom, this.ytop, this.znear, this.zfar);
	}
	
	this.toSpace = function(x,y){
		var px = ((x/this.w)*2-1)*this.ratio/this.min;
		var py = ((y/this.h)*2-1)/this.min;
		return [px,-py];
	}
	
	this.restore();
}