Quaternion = function(x, y, z, w) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = (w !== undefined) ? w : 1;
};

Quaternion.prototype = {
	x : 0,
	y : 0,
	z : 0,
	w : 0,

	setFromAxisAngle : function(axis_normal_vector, angle) {
		var halfAngle = angle / 2; 
		var factor = Math.sin(halfAngle);
		this.x = axis_normal_vector[0] * factor;
		this.y = axis_normal_vector[1] * factor;
		this.z = axis_normal_vector[2] * factor;
		this.w = Math.cos(halfAngle);
		return this;
	},

	multiply : function(b) {
		var qax = this.x, qay = this.y, qaz = this.z, qaw = this.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;
	},

	makeRotationFromQuaternion : function() {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		var result = mat4();

		result = [ [ 1 - (yy + zz), xy - wz, xz + wy, 0 ],
				[ xy + wz, 1 - (xx + zz), yz - wx, 0 ],
				[ xz - wy, yz + wx, 1 - (xx + yy), 0 ], [ 0, 0, 0, 1 ] ];

		return result;
	},
};