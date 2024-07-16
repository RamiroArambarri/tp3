//Clase con las propiedades básicas de los enemigos, que me sirve para generar facilmente distintos tipos de enemigos. Todos los enemigos tendrán una propiedad prop, que contendrá un objeto PropEnemigos
class PropEnemigos {
    constructor(x, y, vx, vy, vida, diam, puntos, imagen) {
        this.mov = new Mov(x, y, vx, vy); //Objeto Mov para controlar el movimiento de los enemigos
        this.vida = vida; //Cantidad de golpes que le queda por recibir al enemigo
        this.diam = diam; //diametro de los enemigos
        this.index; //variable que en cada fotograma guarda el número de indice de cada enemigo en el array de enemigos, a fin de poder eliminarse del array mediante un método del propio enemigo
        this.imagen = imagen;
        this.puntos = puntos; //Puntos que te da el enemigo al matarlo
        this.golpeado = false; //Vale true los instantes siguientes a que lo golpeen
        this.tiempoGolpe; //momento en el que el enemigo fue golpeado
    }

    evaluarDaño() {
        //Para verificar si una bala golpeó al enemigo, se recorre el array de balas evaluando la colisión
        for (let i = 0; i < balasBuenas.length; i++) {
            if (dist(balasBuenas[i].mov.pos.x, balasBuenas[i].mov.pos.y, this.mov.pos.x, this.mov.pos.y) < this.diam / 2 + balasBuenas[i].diam / 2) {
                //En caso de colisión con la bala, al enemigo se le resta vida y la bala se elimina del escenario
                this.vida--;
                balasBuenas.splice(i, 1);
                //Guardo la información de que el enemigo fue golpeado y el momento, para poder pintarlo de rojo.
                this.golpeado = true;
                this.tiempoGolpe = tiempo;
            }
        }
        //Cuando la vida del enemigo llega a 0
        if (this.vida <= 0) {
            //Lo elimino del array
            enemigos.splice(this.index, 1);
            //Sumo la puntuación
            puntuacion += this.puntos;
            //Guardo la infomación de que murió
            enemigoEliminado = true;
            //Activo el sonido de la explosión
            sonidoExplosion.play();
        }
    }

    actualizar() {
        //Se actualiza el movimiento, se evalúa si una bala lo golpeó o si se fue del escenario
        this.mov.actualizar();
        this.evaluarDaño();
        this.evaluarLimite();

        //La información de que el enemigo fue golpeado se guarda durante 50 ms para pintarlo de rojo
        if(this.golpeado && tiempo - this.tiempoGolpe > 50){
            this.golpeado = false;
        }
    }

    mostrar() {
        //Método para mostrar al enemigo
        //push y pop para que el tint() no interactúe con otros elementos del draw
        push()
        if(this.golpeado){
            //Si fue recientemente golpeado, se lo pinta de rojo
            tint(255, 0, 0);
        }
        //Muestro la imagen del enemigo
        image(this.imagen, this.mov.pos.x - this.diam / 2, this.mov.pos.y - this.diam / 2);
        pop()
    }

    evaluarLimite() {
        //Método que evalúa si el enemigo salió del límite de la pantalla, y si es así, la elimina del array de enemigos.
        if (this.mov.pos.y < -500 ||
            this.mov.pos.y > height + 500) {
            enemigos.splice(this.index, 1);
            enemigoEliminado = true;
        }
    }
}

//Cláse para el primer tipo de enemigo
class Enemigo1 {
    constructor(x, y) {
        //Un objeto PropEnemigos para las propiedades básicas. Quiero que inicie quieto, resista un solo toque, tenga 25 px de diámetro y dé un punto al eliminarlo. Posicion inicial la determinaré desde el draw cuando lo cree.
        this.prop = new PropEnemigos(x, y, 0, 0, 1, 25, 1, imagenEnemigo1);
        this.fase = random(2 * PI); //Como quiero que estos enemigos tengan un movimiento sinusoidal, les asigno una fase inicial aleatoria
        this.posCentral = random(anchoUI + 100, width - 100); //El movimiento sinusoidal está centrado en un eje, que asigno al azar
    }
    actualizar() {
        //Actualización del enemigo
        //La posición en x la controlo directamente fotograma a fotograma
        this.prop.mov.pos.x = this.posCentral + 100 * cos(tiempo * 0.003 + this.fase);
        //Asigno una velocidad vertical constante
        this.prop.mov.vel.y = 150;
        //Ejecuto las actualiaciones básicas que programé en el objeto PropEnemigos (movimiento, evaluación de daño y límites)
        this.prop.actualizar();
    }
    //Me copio el metodo mostrar del objeto PropEnemigos, poder acceder a él directamente desde el objeto Enemigos1, sin tener que entrar al .prop.
    mostrar() {
        this.prop.mostrar();
    }
} 

//Cláse para el primer tipo de enemigo
class Enemigo2 {
    constructor(x, y, vx, vy) {
        //Un objeto PropEnemigos para las propiedades básicas: inicia quieto, 5 vidas, 30 de diámetro, 5 puntos al matarlo. La posicion inicial la determinaré desde el draw cuando lo cree.
        this.prop = new PropEnemigos(x, y, 0, 0, 5, 30, 5, imagenEnemigo2);
        this.yMax = random(width/3) //La altura hasta la que bajará antes de detenerse
        this.tiempoSigDisparo = tiempo + 1000; //el tiempo en el que realizará el siguiente disparo (el primero es 1 segundo después de crearse)
    }
    actualizar() {
        //Actualización del enemigo
        //Quiero que baje hasta llegar a su posición final y se detenga
        this.prop.mov.vel.y = this.prop.mov.pos.y < this.yMax ? this.prop.mov.vel.y = 300 : 0
        //Ejecuto las actualiaciones básicas que programé en el objeto PropEnemigos (movimiento, evaluación de daño y límites)
        this.prop.actualizar();
        //Cuando el tiempo alcanza el momento del siguiente disparo, se edispara, y se determina aleatoriamente el momento del siguiente.
        if(tiempo > this.tiempoSigDisparo){
            this.disparar()
            this.tiempoSigDisparo = tiempo + random(200, 500)
        }
    }
    disparar(){
        //Se determina al azar el ángulo del disparo
        let angulo = random(0, PI)
        //Se crea una nueva bala que se disparará hacia el angulo decidido con una rapidez de 200 px/s
        balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, 200*cos(angulo), 200*sin(angulo)))
    }
    //Me copio el metodo mostrar del objeto PropEnemigos, poder acceder a él directamente desde el objeto Enemigos1, sin tener que entrar al .prop.
    mostrar() {
        this.prop.mostrar();
    }
} 



class Enemigo3 {
    constructor(x, y, vx, vy) {
        //Un objeto PropEnemigos para las propiedades básicas. Empieza quieto, 60 vidas, 60 px de diámetro, 20 puntos al matarlo.  La posicion inicial la determinaré desde el draw cuando lo cree.
        this.prop = new PropEnemigos(x, y, 0, 0, 60, 60, 20, imagenEnemigo3);
        this.yMax = width/4 //Altura hasta la que bajará antes de detenerse
        this.tiempoSigDisparo; //Momento del siguiente disparo dentro de un patrón de ataque
        this.tiempoSigPatron = tiempo + 3000; //Tiempo entre patrones de ataque
        this.tiempoFinPatron = tiempo + 5000; //Duración de los patrones de ataque
        this.patron = 0; //Vale 0 cuando no está disparando. 1 para el primer patrón de ataque, 2 para el segundo y 3 para el tercero
    }
    actualizar() {
        if(!animacionVictoria){
        //Actualización del enemigo
        //Quiero que baje hasta llegar a su posición final y se detenga
        this.prop.mov.vel.y = this.prop.mov.pos.y < this.yMax ? this.prop.mov.vel.y = 100 : 0;
        //Ejecuto las actualiaciones básicas que programé en el objeto PropEnemigos (movimiento, evaluación de daño y límites)
        this.prop.actualizar();
        //Si es momento de ejecutar el siguiente patrón y no se está ejecutando ningun patrón (patron == 0), se inicia el siguiente patróm
        if(tiempo > this.tiempoSigPatron && this.patron == 0){
            //Se determina al azar cual será el siguiente patrón de ataque
            this.patron = floor(random(1, 4))
            //Se inicia disparando
            this.tiempoSigDisparo = tiempo;
            //Los patrones duran 5 segundos
            this.tiempoFinPatron = tiempo + 5000;
        }
        
        if(tiempo > this.tiempoSigDisparo && this.patron != 0){
            //Si se está ejecutando un patrón y llega el momento de disparar, se dispara
            this.disparar()
        }

        //Si se está ejecutando un patrón y ya tiene que terminar, termina
        if(this.patron != 0 && this.tiempoFinPatron < tiempo){
            //Patrón vuelte a 0
            this.patron = 0;
            //El siguiente patron es en 5 segundos
            this.tiempoSigPatron = tiempo + 5000;
        }
        //Si el jefe muere se inicia la animación de la explosión
        if(this.prop.vida <= 0) {
            animacionVictoria = true;
            inicioAnimacionVictoria = tiempo;
        }
        }
        
    }
    disparar(){
        //Patrónes de ataque
        //Primer patrón: doble espiral
        if(this.patron == 1){
            //Determino un angulo que va avanzando con el timpo y se lo asigno a las balas que van apareciendo en direcciones contrarias cada intervalos de 100 ms
            let angulo = 2*PI*tiempo/2000;
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, 200*cos(angulo), 200*sin(angulo)));
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, -200*cos(angulo), -200*sin(angulo)));
            this.tiempoSigDisparo = tiempo + 100;
        }
        //Segundo patrón: espital mariposa
        if(this.patron == 2){
            //Idem el patrón 1, pero son 4 espirales y aparecen cada 150 ms.
            let angulo = 2*PI*tiempo/3000;
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, 200*cos(angulo), 200*sin(angulo)));
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, 200*cos(angulo), -200*sin(angulo)));
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, -200*cos(angulo), -200*sin(angulo)));
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, -200*cos(angulo), 200*sin(angulo)));
            this.tiempoSigDisparo = tiempo + 150;
        }
        //Patrón 3: aleatorio
        if(this.patron == 3){
            //Determino un angulo aleatorio hacia abajo y se lo asigno a las balas que aparecen cada 30 ms.
            let angulo = random(PI)
            balasEnemigas.push(new Bala2(this.prop.mov.pos.x, this.prop.mov.pos.y, 300*cos(angulo), 300*sin(angulo)));
            this.tiempoSigDisparo = tiempo + 30;
        }
    }
    //Los siguiente métodos me los copio del objeto PropEnemigos, para poder acceder a ellos directamente desde el objeto Enemigos1, sin tener que entrar al .prop.
    mostrar() {
        //Mostrar barra de vida
        noStroke();
        fill(255, 255, 255, 80);
        rect(anchoUI + 10, height - 30, (width - anchoUI) - 20, 20)
        fill(255, 0, 0, 80);
        rect(anchoUI + 12, height - 28, constrain(((width - anchoUI) - 24)*this.prop.vida/60, 0, 400), 16)
        //El sprite del jefe se muestra a menos que ya halla muerto. Si no, se muestra la animación de la explosión
        if(!animacionVictoria){
            this.prop.mostrar();
        } else {
                //Animación de explosión
                noFill()
                strokeWeight(10);
                stroke(255, 0, 0)
                circle(this.prop.mov.pos.x, this.prop.mov.pos.y, tiempo - inicioAnimacionVictoria, tiempo - inicioAnimacionVictoria)
              }
        }
} 

class Enemigo4 {
    constructor(fase, distancia, direccion) {
        //Un objeto PropEnemigos para las propiedades básicas. inicia en el 0 0, quieto. Tiene 2 vidas, 30 px de diámetro, no da puntos al matarlo.
        this.prop = new PropEnemigos(0, 0, 0, 0, 2, 30, 0, imagenEnemigo4); 
        this.fase = fase //Posición del circulo en la que se encontrará
        this.distancia = distancia; //Distancia al centro del círculo
        this.direccion = direccion; //dirección de giro
    }
    actualizar() {
        //Actualización del enemigo
        //La posición en x la controlo directamente fotograma a fotograma de manera que giren alrededor del jefe
        this.prop.mov.pos.x = jefeFinal.prop.mov.pos.x + this.direccion*this.distancia*cos(tiempo/900 + this.fase)
        this.prop.mov.pos.y = jefeFinal.prop.mov.pos.y + this.distancia*sin(tiempo/900 + this.fase)
        //Asigno una velocidad vertical constante
        this.prop.mov.vel.y = 100;
        //Ejecuto las actualiaciones básicas que programé en el objeto PropEnemigos (movimiento y evaluación de daño)
        this.prop.actualizar();
    }
    //Los siguiente métodos me los copio del objeto PropEnemigos, para poder acceder a ellos directamente desde el objeto Enemigos1, sin tener que entrar al .prop.
    mostrar() {
        this.prop.mostrar();
    }
} 