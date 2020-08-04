var ExtrusaoSolid = function(){
	this.perfil = [];
	this.trajetoria = [];
	this.geometry = [];
	this.indices = [];
	this.perfilScale = 0.05;
	
	this.update = function(perfil,trajetoria){
		this.perfil = perfil;
		this.trajetoria = trajetoria;
		this.geometry = this.createGeometry();
	}
	
	getAngle = function(curr,prev,next){
		var tan = subtract(curr,next);
		
		var y = curr[1]<next[1] ? [0,0,1] : [0,0,-1];
		var n =  normalize(cross(tan,y));
		var s = dot([0,1,0],n);
		return Math.acos(s);
	}
	
	rotatePointZ = function(p,a){
		var x = p[0]*Math.cos(a) - p[1]*Math.sin(a);
		var y = p[0]*Math.sin(a) + p[1]*Math.cos(a);
		var z = p[2];
		return([x,y,z])
	}
	
	
	this.createGeometry = function(){
		var t = this.trajetoria;
		var p = escalarPontos(this.perfil,this.perfilScale);
		var g = [];
		for(var i = 0; i < t.length; i++){
			var prev = (i > 0) ? t[i-1] : t[0];
			var next = (i == t.length-1) ? t[i] : t[i+1];
			var curr = t[i];
			var a = getAngle([curr[0],curr[1],0],[prev[0],prev[1],0],[next[0],next[1],0]);
			for(var j = 0; j < p.length; j++){
				var vertex = [0,0,0];
				vertex[1] = p[j][1]
				vertex[2] = p[j][0];
				
				vertex = rotatePointZ(vertex,a);
				vertex[0]+= t[i][0];
				vertex[1]+= t[i][1];
				
				g.push(vertex);
			}
		}
		return g;
	}
}

function escalarPontos(a,s){
	var temp = [];
	for(var i = 0; i < a.length; i++){
		temp.push(escalar(a[i],s));
	}
	return temp;
}

function escalar(v,s){
	var temp = [];
	for(var i = 0; i < v.length; i++){
		temp[i] = v[i]*s;
	}
	return temp;
}