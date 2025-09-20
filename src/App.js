import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { createReactPlayer } from 'react-player/ReactPlayer';

function App() {
  // Estados para el menú y navegación
  const [menuActivo, setMenuActivo] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
  const [progresoscroll, setProgresoScroll] = useState(0);
  // Estados para contador de días
  const [diasJuntos, setDiasJuntos] = useState(0);
  const[diasdesde2024,setDiasdesde2024] = useState(0);

  // Estados para favoritos
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Función para calcular días transcurridos
  const calcularDiasJuntos = () => {
    const fechaInicio = new Date('2023-09-19');
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diferencia / milisegundosPorDia);
  };

  const calculardesde2024 = ()=>{
    const fechaInicio = new Date('2024-09-19');
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diferencia / milisegundosPorDia);
  };

  // Funciones para favoritos
  const toggleFavorito = (item) => {
    setFavoritos(prevFavoritos => {
      const yaEsFavorito = prevFavoritos.find(fav => fav.id === item.id);
      
      if (yaEsFavorito) {
        return prevFavoritos.filter(fav => fav.id !== item.id);
      } else {
        return [...prevFavoritos, { ...item, fechaAgregado: new Date() }];
      }
    });
  };

  const esFavorito = (itemId) => {
    return favoritos.some(fav => fav.id === itemId);
  };

  // Componente BotonFavorito
  const BotonFavorito = ({ item, className = "" }) => {
    const isFav = esFavorito(item.id);
    
    return (
      <button
        onClick={() => toggleFavorito(item)}
        className={`favorito ${isFav ? 'activo' : ''} ${className}`}
        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <span>{isFav ? '❤️' : '🤍'}</span>
        <span>Agregar a favorito</span>
      </button>
    );
  };

  // Función para scroll suave
  const scrollSuave = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setMenuActivo(false); // Cerrar menú en móvil
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Header scrolled
      setHeaderScrolled(scrollY > 50);
      
      // Botón arriba
      setMostrarBotonArriba(scrollY > 300);
      
      // Progreso de scroll
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      const progreso = (scrollY / alturaTotal) * 100;
      setProgresoScroll(progreso);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para calcular días iniciales
  useEffect(() => {
    setDiasJuntos(calcularDiasJuntos());
    const interval = setInterval(() => {
      setDiasJuntos(calcularDiasJuntos());
    }, 3600000); // Actualizar cada hora

    return () => clearInterval(interval);
  }, []);
  
    useEffect(() => {
    setDiasdesde2024(calculardesde2024());
    const interval = setInterval(() => {
      setDiasdesde2024(calculardesde2024());
    }, 3600000); // Actualizar cada hora

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* Indicador de progreso */}
      <div 
      
      

        className="indicador-scroll" 
        style={{ width: `${progresoscroll}%` }}
      />

      {/* Header */}
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <nav className="barra-navegacion">
          <div className="marca-navegacion">
            <h1 onClick={scrollToTop}>Thogeder💖</h1>
          </div>
          
          <ul className={`menu-navegacion ${menuActivo ? 'activo' : ''}`}>
            <li><a href="#inicio" onClick={(e) => {e.preventDefault(); scrollSuave('inicio')}}>🏠</a></li>
            <li><a href="#historia" onClick={(e) => {e.preventDefault(); scrollSuave('historia')}}>📖</a></li>
            <li><a href="#momentos" onClick={(e) => {e.preventDefault(); scrollSuave('momentos')}}>✨</a></li>
            <li><a href="#galeria" onClick={(e) => {e.preventDefault(); scrollSuave('galeria')}}>📸</a></li>
            <li><a href='#reproductor' onClick={(e)=>{e.preventDefault();scrollSuave('reproductor')}}>🔈</a></li>
            <li><a href="#timeline" onClick={(e) => {e.preventDefault(); scrollSuave('timeline')}}>⏰</a></li>
            <li><a href="#cartas" onClick={(e) => {e.preventDefault(); scrollSuave('cartas')}}>💌</a></li>
            <li><a href="#planes" onClick={(e) => {e.preventDefault(); scrollSuave('planes')}}>🌟</a></li>
            
          </ul>
          
          <div 
            className={`menu-hamburguesa ${menuActivo ? 'activo' : ''}`}
            onClick={() => setMenuActivo(!menuActivo)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>

      {/* Contenido principal */}
      <main>
        {/* Sección Inicio */}
        <section id="inicio" className="seccion-principal">
          <div className="contenido-principal">
            <h2 className="titulo-aniversario">Celebrando Dos Años de Amor</h2>
            <p className="fecha-aniversario">Desde el 19 de septiembre de 2023</p>
            <div className="contador-amor">
              <span className="numero-dias">{diasJuntos}</span>
              <span>días juntos</span>
            </div>
            <img 
              className="imagen-representativa" 
              src={process.env.PUBLIC_URL + '/images/fotoPrincipal.jpg'} 
              alt="TE AMO FLACA" 
              height="300" 
              width="200"
            />   
          </div>
        </section>

        {/* Sección Historia */}
        <section id="historia" className="seccion-historia">
          <div className="contenedor">
            <h2 className="titulo-seccion">Nuestra Historia de Amor</h2>
            <div className="contenido-historia">
              
              <div className="capitulo-historia">
                <h3>El Primer Encuentro</h3>
                <p className="texto-historia">
                  El día que nos conocimos, Dios míoooooo que día, resulta y pasa que yo iba a cine, de no haber ido a cine esta historia tan hermosa
                  no sería realidad, eso fue un 26 de julio tu ibas a ver barbie y yo oppenheimer, pero al final no habían boletas para ninguna de las dos
                  así que fuimos a creps a hacerles compañía y ahí estabas tú con tu busito que decía que era de abuelita pero realmente te veías hermosísisimaaa
                  era un busito rosado me acuerdo muy bien en fin jejejeje, tú estabas comiendo un postre de frutos rojos
                  y yo me senté al lado primero me dijiste que estaba muy desechable y luego me compartiste de tu postre,
                  muchas gracias por cierto...
                  <br/><br/>
                  En fin luego de eso nos fuimos al parque de centro chía ahí nos acostamos tú estabas con quintero y ya desde ahí
                  empezó nuestra historia, lo chistoso fue que no sabíamos que iba a comenzar una historia tan hermosa.
                </p>
              </div>
              
              <div className="capitulo-historia">
                
                <h3>Los Primeros Días</h3>
                <p className="texto-historia">
                  Ay Dios mío como no olvidar los primeros días wow, ya hace más de dos años empezamos a hablar y ahora míranos aquí juntos, me acuerdo que yo te iba a acompañar
                  a musica y que fue chistoso porque mu abuela decia que a donde iba y yo le decia que a acompañar a una amiga jajajajaaj y ahora miranos
                  tambien como olvidar los descansos tu y yo hablando, riendonos y de todo, Dio mio que tiempos aquellos.
                </p>
                <BotonFavorito 
                  item={{
                    id: 'historia-primeros-dias',
                    tipo: 'momento',
                    titulo: 'Los Primeros Días',
                    descripcion: 'Como no olvidar los primeros días wow, ya hace más de dos años empezamos a hablar y ahora míranos aquí juntos'
                  }} 
                />
              </div>
              
              <div className="capitulo-historia">

                <h3>Cuando Supimos que Era Especial</h3>
                <p className="texto-historia">
                Siento que el dia que supimos que era especial o bueno yo supe que era especial fue el dia del terremoto, yo decia
                yo no me voy a preocupar por nadie y literal ese dia yo todo preocupado que si estabas bien que como estaba Ana, ay Dios
                y llegar a la casa buscar internet porque no tenia internet y escribirte si estabas bien, realmente en ese dia 
                supe que ya era otro nivel.
                </p>
                <BotonFavorito 
                  item={{
                    id: 'historia-especial',
                    tipo: 'momento',
                    titulo: 'Cuando Supimos que Era Especial',
                    descripcion: 'El dia que supimos que era especial fue el dia del terremoto, yo decia yo no me voy a preocupar por nadie y literal ese dia yo todo preocupado'
                  }} 
                />
              </div>
              
              <div className="capitulo-historia">

                <h3>Creciendo Juntos</h3>
                <p className="texto-historia">
                  Siento que hemos tenido demasiados momentos sabes, momentos lindos, momentos no tan lindos pero siempre persiste
                  el amor, siento que nuestro momento mas lindo han sido los paseos y la manera en que conectamos y nos
                  quedamos riendo solo con vernos esos siento que son nuestros momentos mas lindos en nuestra relacion, no hay
                  un momento exacto pero si me preguntan esos pequeños momentos hacen la diferencia.
                </p>
                  <BotonFavorito 
                  item={{
                    id: 'historia-creciendo',
                    tipo: 'momento',
                    titulo: 'Creciendo Juntos',
                    descripcion: 'Hemos tenido demasiados momentos sabes, momentos lindos, momentos no tan lindos pero siempre persiste el amor'
                  }} 
                />
              </div>
              
              <div className="capitulo-historia">

                <h3>El Presente</h3>
                <p className="texto-historia">
                  Uffffff amor ahora siento que somos una relacion mucho, pero mucho mas madura de lo que eramos
                  hace dos años flaca, hemos crecido tanto mi vida osea de una manera que siento que nos vemos hace dos años
                  y digo Dios mio cuanto tiempo, obviamente el amor ha crecido, nuestras responsabilidades y todo, pero siento que hemos aprendido de nosotros
                  y de nuestras experiencias para ser la pareja que somos hoy.
                </p>
                  <BotonFavorito 
                  item={{
                    id: 'historia-presente',
                    tipo: 'momento',
                    titulo: 'El Presente',
                    descripcion: 'Ahora siento que somos una relacion mucho mas madura de lo que eramos hace dos años flaca, hemos crecido tanto'
                  }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección Momentos */}
        <section id="momentos" className="seccion-momentos">
          <div className="contenedor">
            <h2 className="titulo-seccion">Momentos Especiales</h2>
            <div className="cuadricula-momentos">
              <div className="tarjeta-momento">

                <h3>Primera Cita</h3>
                <p>No sé si cuente como primera cita las veces que te acompañaba a música o cuando fuiste a mi cumple pero definitivamente
                    la primera primera fue el día que te llevé a comer sanchipapa, sé que fue mientras ya estábamos juntos
                    pero wow ver esos ojitos tuyos brillar por esa cita en serio me llenó tanto y fue simplemente la primera de muchas citas inolvidables en nuestra relación.
                </p>
                  <BotonFavorito 
                  item={{
                    id: 'momento-primera-cita',
                    tipo: 'momento',
                    titulo: 'Primera Cita',
                    descripcion: 'No sé si cuente como primera cita las veces que te acompañaba a música pero definitivamente la primera primera fue el día que te llevé a comer sanchipapa'
                  }} 
                />
              </div>

              <div className="tarjeta-momento">
                <h3>Primer Viaje Juntos</h3>
                <p>Nuestro primer viaje juntos fue a aguachica, Dios mio amor yo estaba asustado, pero asustado no es palabra, por tu papa por todo
                  literal pero ufffffff ese viaje fue, dejame decirte que ese viaje nos dio tanta vida amor y definitivamente quiero viajar mucho mas contigo.
                </p>
                  <BotonFavorito 
                  item={{
                    id: 'momento-primer-viaje',
                    tipo: 'momento',
                    titulo: 'Primer Viaje Juntos',
                    descripcion: 'Nuestro primer viaje fue a aguachica, Dios mio amor yo estaba asustado, pero asustado no es palabra, por tu papa por todo literal pero ese viaje nos dio tanta vida'
                  }} 
                />
              </div>

              <div className="tarjeta-momento">
               
                <h3>Primer Aniversario</h3>
                <p>Nuestro primer añito que fue hace {diasdesde2024} dias pero wow que aventuras amorcito que experiencias
                  y fue ese dia un aniversario si pues a lo que eramos nosotros, no nos vimos bien bien pero 
                  en el fin de semana lo celebramos, fuimos a cine y comimos a nuestra manera, nuestro primer añito.
                </p>
                 <BotonFavorito 
                  item={{
                    id: 'momento-primer-aniversario',
                    tipo: 'momento',
                    titulo: 'Primer Aniversario',
                    descripcion: 'Nuestro primer añito que fue hace tiempo pero wow que aventuras amorcito que experiencias y fue ese dia un aniversario si pues a lo que eramos nosotros'
                  }} 
                />
              </div>

            </div>
          </div>
        </section>

        {/* Sección Galería */}
         {/* Sección fotos*/}
        <section id="galeria" className="seccion-galeria">
          <div className="contenedor">
            <h2 className="titulo-seccion">Nuestra Galería</h2>
            <div className="cuadricula-fotos">
              
              {/* FOTOS 1-8 */}
              {[1, 2, 3, 4,5,6,7,8,9,10,11].map((num) => (
                <div key={num} className="elemento-foto">
                  <img 
                    src={process.env.PUBLIC_URL + `/images/foto${num}.jpg`} 
                    alt={`Foto ${num}`} 
                    className="foto-galeria" 
                  />
                  <BotonFavorito 
                    item={{
                      id: `foto-${num}`,
                      tipo: 'foto',
                      titulo: `Nuestra foto ${num}`,
                      descripcion: 'fotito',
                      src: `/images/foto${num}.jpg`
                    }} 
                  />
                </div>
              ))}
              
              {/* VIDEO BARBIE */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/barbie.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-barbie',
                    tipo: 'video',
                    titulo: 'Video Barbie',
                    descripcion: 'Que penita',
                    src: '/video/barbie.mp4'
                  }} 
                />
              </div>
              
              {/* VIDEO ROCK THAT BODY AMORCITO */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/RockThatBodyAmorcito.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-rock-amorcito',
                    tipo: 'video',
                    titulo: 'Rock That Body - Amorcito',
                    descripcion: 'Tu RockYourbody',
                    src: '/video/RockThatBodyAmorcito.mp4'
                  }} 
                />
              </div>
              
              {/* VIDEO ROCK THAT BODY YO */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/RockThatbodyYO.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-rock-yo',
                    tipo: 'video',
                    titulo: 'Rock That Body - Yo',
                    descripcion: 'Mi rockMyBody',
                    src: '/video/RockThatbodyYO.mp4'
                  }} 
                />
              </div>
              
              {/* FOTO CUMPLEAÑOS */}
              <div className="elemento-foto">
                <img 
                  src={process.env.PUBLIC_URL + "/images/cumple flaca.jpg"} 
                  className="foto-galeria" 
                  alt="Cumpleaños" 
                />
                <BotonFavorito 
                  item={{
                    id: 'foto-cumple',
                    tipo: 'foto',
                    titulo: 'Tu Cumpleaños',
                    descripcion: 'Tu pumple',
                    src: '/images/cumple flaca.jpg'
                  }} 
                />
              </div>
              
              {/* FOTO CARMEN */}
              <div className="elemento-foto">
                <img 
                  src={process.env.PUBLIC_URL + "/images/carmen.jpg"} 
                  alt="Carmen" 
                  className="foto-galeria" 
                />
                <BotonFavorito 
                  item={{
                    id: 'foto-carmen',
                    tipo: 'foto',
                    titulo: 'En Carmen',
                    descripcion: 'ilegal con mi mujer',
                    src: '/images/carmen.jpg'
                  }} 
                />
              </div>
              
              {/* VIDEO EMOJI POP */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/emmoji pop.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-emoji-pop',
                    tipo: 'video',
                    titulo: 'Emoji Pop',
                    descripcion: 'que pena',
                    src: '/video/emmoji pop.mp4'
                  }} 
                  />
                  </div>
              {/*Video beso drogadicto */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/heylover.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-rock-amorcito',
                    tipo: 'video',
                    titulo: 'Rock That Body - Amorcito',
                    descripcion: 'Tu RockYourbody',
                    src: '/video/heylover.mp4'
                  }} 
                />
              </div>
              {/*beso drogadicto*/}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/beso drogadicto.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-rock-amorcito',
                    tipo: 'video',
                    titulo: 'Rock That Body - Amorcito',
                    descripcion: 'Tu RockYourbody',
                    src: '/video/beso drogadicto.mp4'
                  }} 
                />
              </div>
              {/*corazoncito */}
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/corazon.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <BotonFavorito 
                  item={{
                    id: 'video-rock-amorcito',
                    tipo: 'video',
                    titulo: 'Rock That Body - Amorcito',
                    descripcion: 'Tu RockYourbody',
                    src: '/video/corazon.mp4'
                  }} 
                />
              </div>
              {/*aniversario */}
               {[1, 2,4,5,6].map((num) => (
                <div key={num} className="elemento-foto">
                  <img 
                    src={process.env.PUBLIC_URL + `/images/aniversario${num}.jpg`} 
                    alt={`aniversario ${num}`} 
                    className="foto-galeria" 
                  />
                  <BotonFavorito 
                    item={{
                      id: `foto-aniversario-${num}`,
                      tipo: 'foto',
                      titulo: `fotito aniversario ${num}`,
                      descripcion: 'fotito',
                      src: `/images/aniversario${num}.jpg`
                    }} 
                  />
                </div>
              ))}
              
            
                  {/*Proximamente */}
                   <div className="elemento-proximamente">
                <h2 className='contenido-carta'>proximamente mas fotos y 
                  videos...</h2>
              </div>
                  </div>
                </div>
               
              </section>
        {/*seccion cartas*/}
        <section id ="cartas" className='cartas'>
                <h1 className='titulo-seccion'>cartas</h1>
                <div className='contenedor'></div>
                <div className='carta'>
                  <BotonFavorito
                item={{
                  id:'carta1',
                  tipo: 'carta',
                  titulo:'primera carta de la pagina',
                  descripcion:'simplemente te amo'
                }
              }/>
                
                  <h3>19/09/2024</h3>
                  <p className='contenido-carta'>
                  hola mi vida, esta es la primera carta de la pagina, que pensabas? que era solo para hoy? no mi vida esta pagina es para siempre mi hermosa,
                  cada dia voy a ir poniendo una cartica para ti mi hermosa un dia x asi que te pido que descargues esto y cada que te diga que lo actualize que lo vayas viendo 
                  porque amorcito tenemos muchas historias pr contar mi niña precios, gracias, simplemente gracias por todo mi hermosa gracias por ser mi polo a tierra mi todo mi flaca hermosa de mi alma
                  simplemente gracias por ser mi polo a tierra, simplemente no se que haria sin ti amorcito, enserio TE AMO TE AMO CON MI ALMA ENTERA, hoy es nuestro aniversario
                  y simplemente no solo por hoy y tambien es la idea de esta app que no solo hoy enamorarte sino cada dia mas y mas y mas mi hermosa, enserio te amo mi vida y gracias
                  gracias por serlo todo para mi, se que no soy muy expresivo o muy detallista y esto es lo que he estado programando durante ya muuuucho tiempo y enserio flaca
                  espero que te haya encantado.
                  </p>
                  <p className='firma-carta'>con muhcho amor tu flaco</p>
                </div>

                
        </section>
      </main>
        
      {/* Footer */}
      <footer>
        <div className="contenedor">
          <div className="contenido-pie">
            <p className="frase-amor">"Es tan natural querer amarnos"</p>
            <p className="texto-pie">Como sea yo te amo</p>
          </div>
        </div>
      </footer>

      {/* Botón volver arriba */}
      {mostrarBotonArriba && (
        <button className="boton-arriba" onClick={scrollToTop}>
          ↑
        </button>
      )}

      {/* Botón flotante de favoritos */}
      <button
        onClick={() => setMostrarFavoritos(true)}
        className="boton-favoritos-flotante"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '80px', // Para que no choque con el botón "arriba"
          backgroundColor: '#e91e63',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        ❤️
        {favoritos.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'white',
            color: '#e91e63',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {favoritos.length}
          </span>
        )}
      </button>

      {/* Panel de favoritos */}
      {mostrarFavoritos && (
        <div 
          className="overlay-favoritos"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setMostrarFavoritos(false)}
        >
          <div 
            className="panel-favoritos"
            style={{
              backgroundColor: 'white',
              width: '400px',
              maxWidth: '90vw',
              height: '100%',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '20px',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '15px'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: '#333',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                ❤️ Favoritos ({favoritos.length})
              </h2>
              <button 
                onClick={() => setMostrarFavoritos(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '5px',
                  color: '#666',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>
            
            {favoritos.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: '#666' 
              }}>
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '20px',
                  opacity: 0.5 
                }}>
                  💔
                </div>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '10px',
                  fontSize: '1.2rem'
                }}>
                  No tienes favoritos aún
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  lineHeight: 1.5,
                  opacity: 0.7
                }}>
                  Haz clic en ❤️ para agregar tus momentos, fotos, videos y canciones favoritas
                </p>
              </div>
            ) : (
              <div style={{ paddingBottom: '20px' }}>
                {favoritos.map((fav) => (
                  <div key={fav.id} style={{
                    backgroundColor: '#f9f9f9',
                    padding: '16px',
                    marginBottom: '12px',
                    borderRadius: '12px',
                    border: '1px solid #eee',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '8px' 
                    }}>
                      <span style={{
                        backgroundColor: '#e91e63',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textTransform: 'capitalize',
                        fontWeight: '500'
                      }}>
                        {fav.tipo === 'cancion' ? '🎵' : fav.tipo === 'video' ? '🎬' : fav.tipo === 'foto' ? '📸' : '✨'} {fav.tipo}
                      </span>
                      <button
                        onClick={() => toggleFavorito(fav)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '50%',
                          transition: 'background-color 0.2s'
                        }}
                        title="Quitar de favoritos"
                      >
                        ❌
                      </button>
                    </div>
                    <h4 style={{ 
                      margin: '0 0 6px 0', 
                      color: '#333',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      {fav.titulo}
                    </h4>
                    {fav.artista && (
                      <p style={{ 
                        margin: '0 0 6px 0', 
                        color: '#666', 
                        fontSize: '14px',
                        fontStyle: 'italic'
                      }}>
                        por {fav.artista}
                      </p>
                    )}
                    <p style={{ 
                      margin: '0 0 10px 0', 
                      color: '#666', 
                      fontSize: '14px',
                      lineHeight: 1.4
                    }}>
                      {fav.descripcion}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: '#999', 
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      🕒 Agregado: {fav.fechaAgregado.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
                
                {/* Botón para limpiar todos los favoritos */}
                {favoritos.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
                        setFavoritos([]);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#ff4757',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginTop: '16px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4757'}
                  >
                    🗑️ Limpiar todos los favoritos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;