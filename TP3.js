let jugador;
let balasBuenas = [];
let balasEnemigas = [];
let enemigos = [];
let enemigoEliminado = false; //variable que se activa cuando un enemigo es eliminado del array de enemigos
let balaBuenaEliminada = false; //variable que se activa cuando un bala es eliminada del array de balas
let balaEnemigaEliminada = false; //variable que se activa cuando un bala es eliminada del array de balas
let tiempoInicio; //Millis en el inicio del juego
let tiempo = 0; //Millis transcurridos desde el inicio del juego
let tiempoSiguiente = 0; //Momento en el que ocurrirá el que ocurrirá el siguiente evento
let anchoUI = 200; //Ancho de la UI que está a la izquierda de la pantalla
let pantalla; //Para la lógica de detados0: pantalla de inicio. 1: nivel. 2: Has muerto. 3: Has ganado.
let animacionGameOver = false; //Variable que se activa cuando el jugador muere, para mostrar la animación de la explosión
let inicioAnimacionGameOver; //Momento en el que se inicia la enimación de la explosión
let animacionVictoria = false; //Variable que se activa cuando el jugador muere, para mostrar la animación de la explosión
let inicioAnimacionVictoria; //Momento en el que se inicia la enimación de la explosión
let puntuacion; //Puntuación del jugador
let batallaFinal; //True cuando ya se activó la batalla final
let jefeFinal;
let imagenNave;
let imagenInicio;
let imagenMuerte;
let imagenVictoria;
let imagenFondo1;
let imagenFondo2;
let imagenFondo3;
let fondoUI;
let imagenEnemigo1;
let imagenEnemigo2;
let imagenEnemigo3;
let imagenEnemigo4;
let sonidoExplosion;
let musica;

//Cargo los sprites, sonidos y la tipografía
function preload() {
  imagenNave = loadImage('imagenes/navecita.png');
  imagenInicio = loadImage('imagenes/pantalla_de_inicio.jpg');
  imagenEnemigo1 = loadImage('imagenes/enemigo1.png');
  imagenEnemigo2 = loadImage('imagenes/enemigo2.png');
  imagenEnemigo3 = loadImage('imagenes/enemigo3.png');
  imagenEnemigo4 = loadImage('imagenes/enemigo4.png');
  imagenFondo1 = loadImage('imagenes/fondo1.png');
  imagenFondo2 = loadImage('imagenes/fondo2.png');
  imagenFondo3 = loadImage('imagenes/fondo3.png');
  imagenMuerte = loadImage('imagenes/pantalla_muerte.jpg');
  fondoUI = loadImage('imagenes/fondo_ui.png')
  imagenVictoria = loadImage('imagenes/pantalla_victoria.jpg');

  sonidoExplosion = loadSound('sonidos/explosion.wav');
  musica = loadSound('sonidos/musica.mp3');

  museoSlab = loadFont('Museo_Slab_700.otf');
}

function setup() {
  createCanvas(600, 600);
  pantalla = 0;
  //Creo un objeto jugador y lo inicializo con las variables
  jugador = new Jugador(width / 2, height / 2);
  //Setteo amplitud de los sonidos e inicio la música
  sonidoExplosion.amp(0.3)
  musica.amp(0.3);
  musica.loop();
}

function draw() {
  if (pantalla == 0) {
    //Si pantalla vale 0, se dibuja la pantalla de inicio
    image(imagenInicio, 0, 0);
  }

  if (pantalla == 1) {
    //Si pantalla vale 1, se desarrolla el nivel
    //funcionesBasicas() controla la mecánica general del juego, actualizar y mostrar los objetos, eliminar las balas que se van del escenario, etc.
    funcionesBasicas();
    //desarrollo() va leyendo el valor de la variable tiempo y añadiendo objetos en el escenario
    desarrollo();
    //dibujarUI dibuja la interfaz de usuario
    dibujarUI();
  }

  if (pantalla == 2) {
    //Si pantalla vale 2, se dibuja la pantalla de game over
    image(imagenMuerte, 0, 0);
  }

  if (pantalla == 3) {
    //Si pantalla vale 0, se dibuja la pantalla de victoria y se muestra el puntaje obtenido
    image(imagenVictoria, 0, 0);
    textFont(museoSlab);
    textAlign(CENTER)
    textSize(32);
    fill(255)
    text('Puntos: ' + puntuacion + '!', width/2, 400);
  }
}

function funcionesBasicas() {
  //dibujo el fondo
  fondo();
  //En caso de que no esté ocurriendo la animación de la explosión, el jugador debe actualizarse y disparar
  if(!animacionGameOver){
  //Actualizo al jugador (posición, estado de movimiento, daño, la presencia del escudo, la vida, verificar que no esté muerto).
  jugador.actualizar();
  //El jugador dispara
  jugador.disparar();
  }
  //Muestro la imágen del jugador, o a la animación de explosión en caso de que corresponda
  jugador.mostrar();

  for (let i = 0; i < enemigos.length; i++) {
    //Le paso a cada enemigo su indice en le arreglo para poder eliminarlos desde un método propio cuando mueran o salgan del escenario
    enemigos[i].prop.index = i;
    //Actualizo posiciones y daños de los enemigos, los elimino en caso de que hayan muerto
    enemigos[i].actualizar();
    //Verifico si durante la actualización se eliminó el enemigo del array. En ese caso, en ese caso, el método splice() hace que todas los enemigos posteriores retrocedana ubicación en el array
    if (enemigoEliminado) {
      //Vuelvo a settear enemigoEliminado en false
      enemigoEliminado = false;
      //retrocedo una posición en el bucle para volver a pasar por la posición i, que ahora es ocupada por otra bala
      i--
       //Salto al siguiente valor de i ya que no quiero mostrar un enemigo que ya no está en el arreglo
      continue;
    }
    //Muestro las imágenes de los enemigos
    enemigos[i].mostrar();
  }

    //En caso de que esté ocurriendo la batalla final, actualizo y muestro al jefe final
    if(batallaFinal){
      jefeFinal.actualizar();
      jefeFinal.mostrar();
    }


  for (let i = 0; i < balasBuenas.length; i++) {
    //Le paso a cada bala su indice en le arreglo para poder eliminarlas desde un método propio cuando choquen o salgan del escenario
    balasBuenas[i].index = i;
    //Actualizo las posiciones de las balas, y las elimino en caso de que se vayan del escenario
    balasBuenas[i].actualizar();
    //Mismo procedimiento que con los enemigos eliminados
    if (balaBuenaEliminada) {
      i--
      balaBuenaEliminada = false;
      continue;
    }
    //Muestro las balas
    balasBuenas[i].mostrar();
  }

  for (let i = 0; i < balasEnemigas.length; i++) {
    //Le paso a cada bala su indice en le arreglo para poder eliminarlas desde un método propio cuando choquen o salgan del escenario
    balasEnemigas[i].index = i;
    //Actualizo las posiciones de las balas, y las elimino en caso de que se vayan del escenario
    balasEnemigas[i].actualizar();
    //Mismo procedimiento que con los enemigos eliminados
    if (balaEnemigaEliminada) {
      i--
      balaEnemigaEliminada = false;
      continue;
    }
    //Muestro las balas
    balasEnemigas[i].mostrar();
  }

  //Si el jugador murió y ya pasó la animación de la explosión
  if(animacionGameOver && tiempo - inicioAnimacionGameOver > 1500) {
    pantalla = 2;
  }
  if(animacionVictoria && tiempo - inicioAnimacionVictoria > 1500) {
    pantalla = 3;
  }
}

function desarrollo() {
  //Calculo el tiempo actual
  tiempo = millis() - tiempoInicio;

  //Durante los primeros 20 segundos de juego quiero que aparezcan enemigos básicos cada 300 milisegundos
  if (tiempo > 0 && tiempo < 20000 && tiempo >= tiempoSiguiente) {
    //Añado los enemigos a su array
    enemigos.push(new Enemigo1(random(150, width - 150), -10));
    //Setteo que el siguiente enemigo aparezca 300 millis después
    tiempoSiguiente = tiempo + 300;
  }

  //Entre el segundo 25 y 37 quiero que aparezcan enemigos del segundo tipo, cada 1.2 segundos
  if (tiempo > 25000 && tiempo < 37000 && tiempo >= tiempoSiguiente) {
    enemigos.push(new Enemigo2(random(anchoUI + 50, width - 50), -10));
    //Setteo que el siguiente enemigo aparezca 1200 millis después
    tiempoSiguiente = tiempo + 1200;
  }

  //Si ya terminaron de aparecer los enemigos de la fase anterior (pasó el segundo 37), la pantalla ya está despejada (enemigos.length == 0) y todavía no inició la batalla final, inicia la batalla final
  if(tiempo > 37000 && enemigos.length == 0 && !batallaFinal){
    batallaFinal = true;
    //añado al jefe final
    jefeFinal = new Enemigo3((width-anchoUI)/2 + anchoUI, -200)
    //añado 3 aros de enemigos alrededor
    for(i = 0; i < 9; i ++){
      enemigos.push(new Enemigo4(2*i*PI/9, 50, 1))
    }
    for(i = 0; i < 10; i ++){
      enemigos.push(new Enemigo4(2*i*PI/10, 100, -1))
    }
    for(i = 0; i < 15; i ++){
      enemigos.push(new Enemigo4(2*i*PI/15, 150, 1))
    }
  }
}

function keyPressed() {
  //Lógica de estados: si estoy en la pantalla de inicio, de game over, o de victoria, quiero que tocando cualquier tecla se inicie (o reinicie) el nivel.
  if (pantalla == 0 || pantalla == 2 || pantalla == 3) {
    iniciar();
  }

  if (pantalla == 1) {
    //Si estoy en la pantalla 1, al tocar las teclas quiero que el personaje se mueva. Guardo la información en las propiedades de mi objeto Jugador
    if (keyCode == UP_ARROW) {
      jugador.movArriba = true;
    }
    if (keyCode == DOWN_ARROW) {
      jugador.movAbajo = true;
    }
    if (keyCode == LEFT_ARROW) {
      jugador.movIz = true;
    }
    if (keyCode == RIGHT_ARROW) {
      jugador.movDer = true;
    }
  }
}

function keyReleased() {
  if (pantalla == 1) {
    //Si estoy en el nivel y suelto una tecla de dirección, quiero que el jugador deje de moverse en esa dirección.
    if (keyCode == UP_ARROW) {
      jugador.movArriba = false;
    }
    if (keyCode == DOWN_ARROW) {
      jugador.movAbajo = false;
    }
    if (keyCode == LEFT_ARROW) {
      jugador.movIz = false;
    }
    if (keyCode == RIGHT_ARROW) {
      jugador.movDer = false;
    }
  }
}

function iniciar() {
  //Función para iniciar (o reiniciar) el nivel.
  //Limpio los array de balas y de enemigos
  balasBuenas.splice(0, balasBuenas.length);
  balasEnemigas.splice(0, balasEnemigas.length);
  enemigos.splice(0, enemigos.length);
  //Reseteo la puntuación
  puntuacion = 0;
  //inicializo el tiempo en 0 y guardo el tiempo de inicio, seteo que el siguiente evento sea en el momento
  tiempoInicio = millis();
  tiempo = 0;
  tiempoSiguiente = 0;
  //No está ocurriendo la batalla final, ni la animación de game over ni la de victoria
  batallaFinal = false;
  animacionGameOver = false;
  animacionVictoria = false;
  //Reinicio todas las propiedades del jugador
  jugador.reiniciar();
  //Paso a la pantalla 1
  pantalla = 1;
}

function fondo() {
  //Dibujo el fondo, que consiste en tres capas que se mueven a distinta velcidad para dar un efecto tipo parallax
  background(0);
  tint(25, 25, 50);
  image(imagenFondo3, anchoUI, -imagenFondo3.height + height + 2 * frameCount % (imagenFondo3.height - height));
  tint(40, 40, 75);
  image(imagenFondo2, anchoUI, -imagenFondo2.height + height + 5 * frameCount % (imagenFondo2.height - height));
  tint(50, 50, 100);
  image(imagenFondo1, anchoUI, -imagenFondo1.height + height + 10 * frameCount % (imagenFondo1.height - height));
  noTint();
}


function dibujarUI() {
  //Dibujo la UI a la derecha de la pantalla
  noStroke();
  fill(150);
  image(fondoUI, 0, 0);

  //Escribo el texto con mi tipografía
  textFont(museoSlab);
  textAlign(CENTER)
  textSize(32);
  fill(0)
  text('Vidas: ' + constrain(jugador.vida, 0, 10), anchoUI/2, 100);
  text('Puntos: ' + puntuacion, anchoUI/2, 200);
}
