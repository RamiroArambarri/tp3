class Jugador {
  constructor(x, y) {
    this.mov = new Mov(x, y, 0, 0); //Objeto Mov para controlar el movimiento del jugador
    this.diam = 20; //Diámetro del jugador
    this.intDisparo = 200; //Intervalo entre disparos, medido en millis
    this.tiempoSigDisparo = 0; //Tiempo que falta para el siguiente disparo
    this.vida = 3 //Vida (cantidad de golpes que puede recibir)
    this.momentoGolpe; //momento en el que el jugador recibió el último golpe. 
    this.escudo = false; //Cuando el jugador recibe un golpe, se activa un escudo que dura 3 segundos
    //Propiedades para la interacción del usuario
    this.movIz = false;
    this.movDer = false;
    this.movArriba = false;
    this.movAbajo = false;
    this.imagen = imagenNave;
  }

  disparar() {
    if (tiempo >= this.tiempoSigDisparo) {
      //Cada vez que el tiempo llega al tiempo del siguiente disparo, se añade una bala en la posición del jugador con una velozidad vertical de 600 hacia arriba
      balasBuenas.push(new Bala1(this.mov.pos.x, this.mov.pos.y, 0, -600));
      //Se recalcula el momento del próximo disparo
      this.tiempoSigDisparo = tiempo + this.intDisparo;
    }

  }

  mostrar() {
    //Si no esta produciendose la animación de la explosión
    if(!animacionGameOver){
      //Si el jugador tiene el escudo, se dibuja
      if (this.escudo) {
        stroke(255);
        strokeWeight(5);
        noFill();
        circle(this.mov.pos.x, this.mov.pos.y, 2 * this.diam);
      }
      //Se muestra la imágen del jugador en su posición correspondiente
      image(this.imagen, this.mov.pos.x - this.diam / 2, this.mov.pos.y - this.diam / 2, this.diam, this.diam);
    }
    //Animación explosión
    if(animacionGameOver){
      //Animación de explosión
      noFill()
      strokeWeight(10);
      stroke(255, 0, 0, 100 + (inicioAnimacionGameOver - tiempo + 400)/10)
      circle(this.mov.pos.x, this.mov.pos.y, constrain(tiempo - inicioAnimacionGameOver - 400, 0, 3000))
      stroke(255, 0, 0, 100 + (inicioAnimacionGameOver - tiempo + 200)/10)
      circle(this.mov.pos.x, this.mov.pos.y, constrain(tiempo - inicioAnimacionGameOver - 200, 0, 3000))
      stroke(255, 0, 0, 100 + (inicioAnimacionGameOver - tiempo)/10)
      circle(this.mov.pos.x, this.mov.pos.y, tiempo - inicioAnimacionGameOver)
    }
  }

  evaluarDaño() {
    //Para cada enemigo, se evalúa si el jugador está colisionando con ese enemigo
    for (let i = 0; i < enemigos.length; i++) {
      if (dist(enemigos[i].prop.mov.pos.x, enemigos[i].prop.mov.pos.y, this.mov.pos.x, this.mov.pos.y) < this.diam / 2 + enemigos[i].prop.diam / 2) {
        //Si ocurre la colisión, se le resta vida al jugador, se le pone el escudo, se guarda el dato del momento en el que se golpeó y se verifica si al jugador le queda vida
        this.vida--;
        this.escudo = true;
        this.momentoGolpe = tiempo;
        //En caso de que la vida sea menor que 0, inicia la animación de game over, y suena una explosión
        if (this.vida < 0) {
          animacionGameOver = true;
          inicioAnimacionGameOver = tiempo;
          sonidoExplosion.play();
        }
      }
    }

    //Idem con las balas enemigas
    for (let i = 0; i < balasEnemigas.length; i++) {
      if (dist(balasEnemigas[i].mov.pos.x, balasEnemigas[i].mov.pos.y, this.mov.pos.x, this.mov.pos.y) < this.diam / 2 + balasEnemigas[i].diam / 2) {
        this.vida--;
        this.escudo = true;
        this.momentoGolpe = tiempo;
        if (this.vida < 0) {
          animacionGameOver = true;
          inicioAnimacionGameOver = tiempo;
          sonidoExplosion.play();
        }
        balasEnemigas.splice(i, 1) //Se elimina la bala en cuestión del arreglo
      }
    }
  }
//Método para actualizar las propiedades del jugador
  actualizar() {
    //La aceleración es 0 a menos que se esté tocando alguna recla
    this.mov.ace.x = 0;
    this.mov.ace.y = 0;

    //Si el jugador está tocando alguna tecla de dirección y la nave no llegó a su velocidad máxima (600), entonces se le adjudica una aceleración en la dirección correspondiente
    if (jugador.movIz && this.mov.vel.x > - 600) {
      this.mov.ace.x = -10000;
    }
    if (jugador.movDer && this.mov.vel.x < 600) {
      this.mov.ace.x = 10000;
    }
    if (jugador.movArriba && this.mov.vel.y > - 600) {
      this.mov.ace.y = -10000;
    }
    if (jugador.movAbajo && this.mov.vel.y < 600) {
      this.mov.ace.y = 10000;
    }
    //Si no se están tocando teclas horizontales, el jugador va frenando horizontalmente.
    //Si la velocidad es muy chica, al disminuirla en 10000 (px/s^2), podría cambiar de dirección en vez de frenarse. Por eso verifico primero que la velocidad sea suficiente como para frenarse con la deceleración predeterminada
    if (!this.movIz && !this.movDer) {
      if (this.mov.vel.x < - 10000 / frameRate()) {
        this.mov.ace.x = 10000;
      } else if (this.mov.vel.x > 10000 / frameRate()) {
        this.mov.ace.x = -10000;
      } else {
        //Si la velocidad es tan chica que al frenarse con la deceleración predeterminada cambiaría de dirección, entonces seteo directamente la velocidad en 0 
        this.mov.vel.x = 0;
      }
    }
    //Idem con las velocidades verticales
    if (!this.movAbajo && !this.movArriba) {
      if (this.mov.vel.y < - 10000 / frameRate()) {
        this.mov.ace.y = 10000;
      } else if (this.mov.vel.y > 10000 / frameRate()) {
        this.mov.ace.y = -10000;
      } else {
        this.mov.vel.y = 0;
      }
    }
    //En base a las aceleraciones determinadas, actualizo el movimiento del jugador
    this.mov.actualizar();

    //Configuro las colisiones para que el jugador no pueda salirse de la pantalla
    if (this.mov.pos.x < anchoUI + this.diam / 2) {
      this.mov.pos.x = anchoUI + this.diam / 2;
    } else if (this.mov.pos.x > width - this.diam / 2) {
      this.mov.pos.x = width - this.diam / 2;
    }
    if (this.mov.pos.y < 0) {
      this.mov.pos.y = 0;
    } else if (this.mov.pos.y > height - this.diam / 2) {
      this.mov.pos.y = height - this.diam / 2;
    }

    //Si el jugador no tiene escudo, evalúo si está chocando con algún enemigo o bala enemiga, con el método anteriormente creado
    if (!this.escudo) {
      this.evaluarDaño();
    } else {
      //En caso de que el jugador tenga el escudo, verifico si ya transcurrió el tiempo para sacarlo.
      if (tiempo - this.momentoGolpe > 3000) {
        this.escudo = false;
      }
    }  
  }
  
  //Método para reinicializar todas las variables del jugador
  reiniciar() {
    this.vida = 3;
    this.mov.pos.x = width / 2;
    this.mov.pos.y = height / 2;
    this.mov.vel.x = 0;
    this.mov.vel.y = 0;
    this.tiempoSigDisparo = tiempo;
    this.escudo = false;
  }
}