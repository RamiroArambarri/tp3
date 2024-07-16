//Clase referida a una posición
class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//Clase referida a una velocidad
class Vel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//Clase referida a una aceleración
class Ace {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//Clase que contiene los parametros del movimiento de un cuerpo. Todos los objetos que se muevan van a tener como propiedad un objeto Mov 
class Mov {
    constructor(x, y, vx, vy) {
        //Mov incluye posición, velocidad y aceleración
        this.pos = new Pos(x, y)
        this.vel = new Vel(vx, vy)
        this.ace = new Ace(0, 0)
    }

    actualizar() {
        //Ecuaciónes básicas de movimiento.
        if (frameCount > 1) {
            //Divido por frameRate() porque quiero trabajar con velocidad por segundo, no por fotograma. Así la velocidad de los movimientos ya no depende de los fps a los que corra el juego (matemáticamente 1/frameRate() sería el diferencial de tiempo por el que voy a integrar posición y velocidad)
            this.vel.x += this.ace.x / frameRate();
            this.vel.y += this.ace.y / frameRate();
            this.pos.x += this.vel.x / frameRate();
            this.pos.y += this.vel.y / frameRate();
        }
    }
}