var PerfilCurves = function(){
	this.ragCurve = [];
	this.bsplineCurve = [];
	this.segmentCount = 10;
	this.sigma = 0.1;
	this.degree = 4;
	this.controls = [];
	
	this.update = function(c){
		this.controls = c;
		this.updateBSpline();
		this.updateRag();
	}
	
/* B-SPLINES */
	function f(t,controls,degree){
		var x=0,y=0;
		for(var i=0; i < controls.length; i++){
			x += controls[i][0]*bn(i,t,degree);
			y += controls[i][1]*bn(i,t,degree);
		}
		return [x,y];
	}
	
	function bn(i,t,k){
		if(k==1){
			if(i<=t&&t<i+1) return 1;
			return 0;
		}
		return ((t-i)/(k-1))*bn(i,t,k-1) + ((i+k-t)/(k-1))*bn(i+1,t,k-1);
		
	}
	
	this.updateBSpline = function(){
		var closeControls = [];
		for(var p=0; p< this.degree-1; p++){closeControls.push(this.controls[p])}	
		var controls = this.controls.concat(closeControls);
		
		var step = (controls.length - (this.degree-1))/(this.segmentCount);
		
		var bs = [];
		
		for(var i=0; i <= this.segmentCount; i++){
			var t = this.degree-1+i*step;
			bs.push(f(t,controls,this.degree));
		}
		
		this.bsplineCurve = bs;
		
	}
	
/* RAGS */

	function p(u,controls,sigma){
		var x=0,y=0;
		var weight = 1; /*todos iguais*/
		var wg = [];
		for(var i=0; i < controls.length; i++){
			wg.push(weight*gc(i,u,sigma,controls.length));
		}
		
		var wgt = wg.reduce(function(a,b){return a+b},0);
		
		for(var i=0; i < controls.length; i++){
			x += controls[i][0] * wg[i]/wgt;
			y += controls[i][1] * wg[i]/wgt;
		}
		return [x,y];
	}
	
	function gc(i,u,s,n){
		var sum = 0;
		for(var j = -3; j <= 3; j++){
			sum+= Math.exp(-Math.pow(u-(i/(n))-j,2)/(2*Math.pow(s,2)));
		}
		return sum;
	}

	this.updateRag = function(){
		var step = 1/(this.segmentCount);
		var r = [];
		for(var i=0; i <= this.segmentCount; i++){
			var u = i*step;
			r.push(p(u, this.controls.concat(), this.sigma));
		}
		
		this.ragCurve = r;
	}
	
}