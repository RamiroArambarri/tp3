class Bala1 {
    constructor(x, y, vx, vy) {
        this.mov = new Mov(x, y, vx, vy); //Objeto Mov para controlar el movimiento de las balas
        this.diam = 15; //diámetro de las balas
        this.index; //variable que en cada fotograma guarda el número de indice de cada enemigo en el array de enemigos, a fin de poder eliminarse del array mediante un método del propio enemigo
    }

    actualizar() {
        this.mov.actualizar(); //Actualización del movimiento de las balas
        this.evaluarLimite(); //Evalúo si ya salieron del límite de la pantalla
    }

    mostrar() {
        //Método para mostrar las balas
        noStroke();
        fill(255, 255, 255);
        ellipse(this.mov.pos.x, this.mov.pos.y, this.diam / 2, this.diam);
    }

    evaluarLimite() {
        //Método que evalúa si la bala salió del límite de la pantalla, y si es así, la elimina del array de balas
        if (this.mov.pos.y < - this.diam ||
            this.mov.pos.y > height - this.diam) {
            balasBuenas.splice(this.index, 1);
            balaBuenaEliminada = true; //Se guarda la información de que una bala fue eliminada
        }
    }
}

class Bala2 {
    constructor(x, y, vx, vy) {
        this.mov = new Mov(x, y, vx, vy); //Objeto Mov para controlar el movimiento de las balas
        this.diam = 20; //diámetro de las balas
        this.index; //variable que en cada fotograma guarda el número de indice de cada enemigo en el array de enemigos, a fin de poder eliminarse del array mediante un método del propio enemigo
    }

    actualizar() {
        this.mov.actualizar(); //Actualización del movimiento de las balas
        this.evaluarLimite(); //Evalúo si ya salieron del límite de la pantalla
    }

    mostrar() {
        //Método para mostrar las balas
        noStroke();
        fill(255, 0, 0);
        ellipse(this.mov.pos.x, this.mov.pos.y, this.diam, this.diam);
        fill(255, 100, 100);
        ellipse(this.mov.pos.x, this.mov.pos.y, 2*this.diam / 3, 2*this.diam / 3);
        fill(255);
        ellipse(this.mov.pos.x, this.mov.pos.y, this.diam / 3, this.diam / 3);
    }

    evaluarLimite() {
        //Método que evalúa si la bala salió del límite de la pantalla, y si es así, la elimina del array de balas
        if (this.mov.pos.y < - this.diam ||
            this.mov.pos.y > height + this.diam ||
            this.mov.pos.x > width + this.diam ||
            this.mov.pos.x < anchoUI - this.diam) {
            balasEnemigas.splice(this.index, 1);
            balaEnemigaEliminada = true; //Se guarda la información de que una bala fue eliminada
        }
    }
}