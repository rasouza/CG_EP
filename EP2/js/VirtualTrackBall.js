/**
 * 
 */

var Ensharable = {} ;

VirtualTrackBall = function(){};

VirtualTrackBall.prototype = {

	setWinSize:function(width, height){
		this.width = width;
		this.height = height;
		this.r = this.min(width, height)/2;
		this.q = new Quaternion();
		this.start;
	},
	
	getTrackBallVector:function(win_x, win_y){
		var x,y,z;
		x = (2.0*win_x-this.width)/this.width;
		y = (this.height-2.0*win_y)/this.height;
		z = 0;
		
		var v = vec3(x, y, z);
		var len = length(v);
		len = (len<1.0) ? len : 1.0;
		z = Math.sqrt(1-len*len);
		v.z = z;
		
		return normalize(v);
	},
	
	//get start position and create track ball vector for start position
	setRotationStart:function(win_x, win_y){
		this.start = this.getTrackBallVector(win_x, win_y);
	},
	
	
	//get new position, create track ball vector, and base on the old vector and new vector,
	//calculate the rotation axial, and angle
	rotateTo:function(win_x, win_y){
		var end = this.getTrackBallVector(win_x, win_y);
		// var axis = end.clone().cross(this.start).nor();
		tempEnd = vec3(end[0], end[1], end[2]);
		tempStart = vec3(this.start[0], this.start[1], this.start[2]);
			
		var axis = normalize(cross(tempEnd, tempStart), false);
		// var dis = 0-end.clone().sub(this.start).len()*2;
		var dis = 0-length(subtract(tempEnd, tempStart))*2;
		
		var curRP = new Quaternion();
		curRP.setFromAxisAngle(axis, dis);

		//this.q.multiply(curRP);
		this.q = curRP.multiply(this.q);
		this.start=end;
	},
	
	//convert it to Quaternion, and merger to the old one, convert to matrix and return
	getRotationMatrix:function(){
		if(this.q===null || this.q===undefined){
			return mat4();
		}
		return this.q.makeRotationFromQuaternion();
	},
	
	min:function(x, y){
		if(x>y){
			return y;
		}else{
			return x;
		}
	},

};