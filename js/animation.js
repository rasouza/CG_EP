var last = 0;
var deltaTime = 0;

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

function tick() {
    requestAnimFrame(tick);
    AnimationUpdate();
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
