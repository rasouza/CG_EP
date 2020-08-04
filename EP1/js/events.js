$(document).keypress(function(event) {
    switch (String.fromCharCode(event.which)) {

        case "w":
            console.log("Andar para Frente");
            speed = 0.003;
            camera.rotate(10, [1,0,0]);
            break;

        case "s":
            console.log("Andar para Traz");
            speed = -0.003;
            camera.rotate(-10, [1,0,0]);
            break;

        case "a":
            console.log("Olha para Esquerda");
            yawRate = 0.1;
            camera.rotate(10, [0,1,0]);
            break;

        case "d":
            console.log("Olha para Direita");
            yawRate = -0.1;
            camera.rotate(-10, [0,1,0]);
            break;

        case "o":
            console.log("Olha para Cima");
            pitchRate = 0.1;
            break;

        case "l":
            console.log("Olha para Baixo");
            pitchRate = -0.1;
            break;

        default:
            speed = 0;
            yawRate = 0;
            pitchRate = 0;
            break
    }
    // console.log( event );
});