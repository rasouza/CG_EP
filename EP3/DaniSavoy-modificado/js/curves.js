const CP = 0.8;

var CONTROLES_PERFIL = function(){return [new vec2(-CP,-CP), new vec2(-CP,CP), new vec2(CP,CP), new vec2(CP,-CP)]}
var CONTROLES_TRAJETORIA = function(){return [new vec2(-CP,-CP), new vec2(0,0), new vec2(CP,CP)]}

var controlesPerfil = CONTROLES_PERFIL();
var controlesTrajetoria = CONTROLES_TRAJETORIA();

var moving = false;

var mi = -1;

var perfilScreen,
	perfilCurves,
	trajetoriaScreen,
	solidoScreen;

function animate(){
		
	perfilScreen.draw();
	trajetoriaScreen.draw();
	extrusaoScreen.draw();
	
	window.requestAnimationFrame(animate);
}

function updateExtrusao(){
	extrusaoSolid.update(getPerfilCurve(),getTrajetoriaCurve());
	extrusaoScreen.segments = extrusaoSolid.geometry;
}

function updatePerfil(w){
	perfilCurves.update(controlesPerfil);
	perfilScreen.segments = getPerfilCurve();
	if(!w) updateExtrusao();
}

function updateTrajetoria(w){
	trajetoriaCurves.update(controlesTrajetoria);
	trajetoriaScreen.segments = getTrajetoriaCurve();
	if(!w) updateExtrusao();
}

var setupScreens = function(){
	perfilCurves = new PerfilCurves();
	perfilScreen = new PerfilScreen();
	perfilScreen.controls = controlesPerfil;
	updatePerfil(true);
	
	//perfilScreen.canvas.addEventListener("click", addControlePerfil);
	perfilScreen.canvas.addEventListener("mousedown", downMoveControlePerfil);
	perfilScreen.canvas.addEventListener("mousemove", moveControlePerfil);
	perfilScreen.canvas.addEventListener("mouseup", upMoveControle);
	perfilScreen.canvas.addEventListener("mouseout", upMoveControle);
	// perfilScreen.tipoSelector.addEventListener("change",changePerfilCurve);
	// perfilScreen.segmentSelector.addEventListener("change",changePerfilSegments);
	// perfilScreen.sigmaSelector.addEventListener("change",changePerfilSigma);
	// perfilScreen.grauSelector.addEventListener("change",changePerfilGrau);
	perfilScreen.zerar.addEventListener("click",zerarPerfil);
	
	trajetoriaCurves = new TrajetoriaCurves();
	trajetoriaScreen = new TrajetoriaScreen();
	trajetoriaScreen.controls = controlesTrajetoria;
	updateTrajetoria(true);
	
	trajetoriaScreen.canvas.addEventListener("mousedown", downMoveControleTrajetoria);
	trajetoriaScreen.canvas.addEventListener("mousemove", moveControleTrajetoria);
	trajetoriaScreen.canvas.addEventListener("mouseup", upMoveControle);
	trajetoriaScreen.canvas.addEventListener("mouseout", upMoveControle);
	// trajetoriaScreen.tipoSelector.addEventListener("change",changeTrajetoriaCurve);
	// trajetoriaScreen.segmentSelector.addEventListener("change",changeTrajetoriaSegments);
	// trajetoriaScreen.sigmaSelector.addEventListener("change",changeTrajetoriaSigma);
	// trajetoriaScreen.grauSelector.addEventListener("change",changeTrajetoriaGrau);
	trajetoriaScreen.zerar.addEventListener("click",zerarTrajetoria);
	
	extrusaoSolid = new ExtrusaoSolid();
	extrusaoScreen = new ExtrusaoScreen();
	updateExtrusao();
	
	extrusaoScreen.scaleSelector.addEventListener("change",changeScale);
	extrusaoScreen.rx.addEventListener("click",function(){rotateExtrusao(0)});
	extrusaoScreen.ry.addEventListener("click",function(){rotateExtrusao(1)});
	extrusaoScreen.rz.addEventListener("click",function(){rotateExtrusao(2)});
	
	animate();
}

var rotateExtrusao = function(axis){
	var m = mat4();
	if(axis == 0) m = rotate(10,[1,0,0]);
	if(axis == 1) m = rotate(10,[0,1,0]);
	if(axis == 2) m = rotate(10,[0,0,1]);
	extrusaoScreen.updateMatrix(m);
}

var changeScale = function(e){
	var s = extrusaoScreen.scaleSelector.value;
	if(s<=0){ 
		extrusaoScreen.scaleSelector.value = 0.005;
		s=0.005;
		window.alert("A escala deve ser maior que 0!");
	}
	extrusaoSolid.perfilScale = s;
	updateExtrusao();
}

var zerarPerfil = function(e){
	controlesPerfil = CONTROLES_PERFIL();
	perfilScreen.controls = controlesPerfil;
	updatePerfil();
}

var zerarTrajetoria = function(e){
	controlesTrajetoria = CONTROLES_TRAJETORIA();
	trajetoriaScreen.controls = controlesTrajetoria;
	updateTrajetoria();
}

var changePerfilGrau = function(e){
	//console.log(e);
	var s = parseInt(perfilScreen.grauSelector.value);
	if(s<2){ 
		perfilScreen.grauSelector.value = 2;
		s=2;
		window.alert("O grau deve ser maior que 2!");
	}
	if(s>perfilCurves.controls.length+1){
		perfilScreen.grauSelector.value = perfilCurves.controls.length+1;
		s = perfilCurves.controls.length+1;
		window.alert("Para este grau são necessários mais pontos de controle!");
	}
	perfilCurves.degree = s;
	updatePerfil();
}

var changeTrajetoriaGrau = function(e){
	var s = parseInt(trajetoriaScreen.grauSelector.value);
	if(s<2){ 
		trajetoriaScreen.grauSelector.value = 2;
		s=2;
		window.alert("O grau deve ser maior que 2!");
	}
	if(s>trajetoriaCurves.controls.length){
		trajetoriaScreen.grauSelector.value = trajetoriaCurves.controls.length;
		s = trajetoriaCurves.controls.length;
		window.alert("Para este grau são necessários mais pontos de controle!");
	}
	trajetoriaCurves.degree = s;
	updateTrajetoria();
}

var changePerfilSigma = function(e){
	var s = perfilScreen.sigmaSelector.value;
	if(s<=0){ 
		perfilScreen.sigmaSelector.value = 0.01;
		s=0.01;
		window.alert("Sigma deve ser maior que 0!");
	}
	perfilCurves.sigma = s;
	updatePerfil();
}

var changeTrajetoriaSigma = function(e){
	var s = trajetoriaScreen.sigmaSelector.value;
	if(s<=0){ 
		trajetoriaScreen.sigmaSelector.value = 0.01;
		s=0.01;
		window.alert("Sigma deve ser maior que 0!");
	}
	trajetoriaCurves.sigma = s;
	updateTrajetoria();
}


var changePerfilSegments = function(e){
	var s = perfilScreen.segmentSelector.value;
	if(s<3){ 
		perfilScreen.segmentSelector.value = 3;
		s=3;
		window.alert("É preciso ao menos 3 segmentos!");
	}
	perfilCurves.segmentCount = s;
	updatePerfil();
}

var changeTrajetoriaSegments = function(e){
	var s = trajetoriaScreen.segmentSelector.value;
	if(s<1){ 
		trajetoriaScreen.segmentSelector.value = 1;
		s=1;
		window.alert("É preciso ao meno 1 segmento!");
	}
	trajetoriaCurves.segmentCount = s;
	updateTrajetoria();
}

var changePerfilCurve = function(){
	perfilScreen.segments = getPerfilCurve();
	perfilScreen.bar.className = perfilScreen.tipoSelector.value;
	updateExtrusao();
}

var getPerfilCurve = function(){ return perfilCurves.bsplineCurve; }

var changeTrajetoriaCurve = function(){
	trajetoriaScreen.segments = getTrajetoriaCurve();
	trajetoriaScreen.bar.className = trajetoriaScreen.tipoSelector.value;
	updateExtrusao();
}

var getTrajetoriaCurve = function(){ return trajetoriaCurves.bsplineCurve; }

var addControlePerfil = function(e){
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = perfilScreen.toSpace(x,y);
	var i = searchClosest(controlesPerfil,p);
	controlesPerfil.splice(i,0,p);
	mi = i;
	updatePerfil();
}

var addControleTrajetoria = function(e){
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = trajetoriaScreen.toSpace(x,y);
	var i = searchClosest(controlesTrajetoria,p);
	controlesTrajetoria.splice(i,0,p);
	mi = i;
	updateTrajetoria();
}

var getMouseX = function(e){
	return e.offsetX || e.layerX;
}

var getMouseY = function(e){
	return e.offsetY || e.layerY;
}

var downMoveControlePerfil = function(e){
	console.log(e);
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = perfilScreen.toSpace(x,y);
	var i = isControlPoint(controlesPerfil,p);
	if(i>-1){
		mi = i;
	} else {
		addControlePerfil(e);
	}
	console.log(mi);
	moving = true;
}

var moveControlePerfil = function(e){
	if(!moving) return;
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = perfilScreen.toSpace(x,y);
	//console.log("m"+mi+" p"+controlesPerfil[mi]);
	controlesPerfil[mi][0] = p[0];
	controlesPerfil[mi][1] = p[1];
	updatePerfil();
}

var downMoveControleTrajetoria = function(e){
	//console.log(e);
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = trajetoriaScreen.toSpace(x,y);
	var i = isControlPoint(controlesTrajetoria,p);
	if(i>-1){
		mi = i;
	} else {
		addControleTrajetoria(e);
	}
	//console.log(mi);
	moving = true;
}

var moveControleTrajetoria = function(e){
	if(!moving) return;
	var x = getMouseX(e);
	var y = getMouseY(e);
	var p = trajetoriaScreen.toSpace(x,y);
	
	controlesTrajetoria[mi][0] = p[0];
	controlesTrajetoria[mi][1] = p[1];
	updateTrajetoria();
}

var upMoveControle = function(e){
	moving = false;
	mi = -1;
	//console.log("up");
}

var isControlPoint = function(a,p){
	for(var i=0; i<a.length; i++){
		if(dist(p,a[i])<0.1) return i;
	}
	return -1;
}

var searchClosest = function(a,p){
	var temp = [];
	var index = 0;
	var min = Infinity;
	a = a.concat([a[0]]);
	for(var i=0; i<a.length-1; i++){
		var d = distanceToSegment(p,a[i],a[i+1]);
		if(d<min){ 
			min = d;
			index = i;
		}
		temp.push(d);
	}
	return index+1;
}
	
var init = function(){
	setupScreens();
}

var dist = function(a,b){
	return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2));
}

window.addEventListener("load", init);


function distanceToSegment(pt,p1,p2){
    var dx = p2[0] - p1[0];
    var dy = p2[1] - p1[1];
    if ((dx == 0) && (dy == 0))
    {
        // It's a point not a line segment.
        closest = p1;
        dx = pt[0] - p1[0];
        dy = pt[1] - p1[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate the t that minimizes the distance.
    var t = ((pt[0] - p1[0]) * dx + (pt[1] - p1[1]) * dy) /
        (dx * dx + dy * dy);

    // See if this represents one of the segment's
    // end points or a point in the middle.
    if (t < 0)
    {
        closest = [p1[0], p1[1]];
        dx = pt[0] - p1[0];
        dy = pt[1] - p1[1];
    }
    else if (t > 1)
    {
        closest = [p2[0], p2[1]];
        dx = pt[0] - p2[0];
        dy = pt[1] - p2[1];
    }
    else
    {
        closest = [p1[0] + t * dx, p1[1] + t * dy];
        dx = pt[0] - closest[0];
        dy = pt[1] - closest[1];
    }

    return Math.sqrt(dx * dx + dy * dy);
}