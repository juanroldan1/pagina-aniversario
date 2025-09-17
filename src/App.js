import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Componente MusicPlayer
const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Cargar playlist desde JSON
  useEffect(() => {
    const cargarPlaylist = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.PUBLIC_URL + '/playlist.json');
        
        if (!response.ok) {
          throw new Error('Error al cargar la playlist');
        }
        
        const data = await response.json();
        setPlaylist(data.canciones);
        setError(null);
      } catch (err) {
        console.error('Error cargando playlist:', err);
        setError('No se pudo cargar la música');
        // Playlist de respaldo
        setPlaylist([
          {
            id: 1,
            title: "Música no disponible",
            artist: "Error de carga",
            src: "",
            duration: "0:00"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarPlaylist();
  }, []);

  useEffect(() => {
    if (playlist.length === 0) return;
    
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    if (audio) {
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      
      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, [currentSong, playlist]);

  const togglePlayPause = () => {
    if (playlist.length === 0) return;
    
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error reproduciendo audio:', err);
        setError('Error al reproducir la canción');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (playlist.length === 0) return;
    setCurrentSong((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (playlist.length === 0) return;
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (e) => {
    if (playlist.length === 0) return;
    
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectSong = (index) => {
    if (playlist.length === 0) return;
    setCurrentSong(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current && playlist.length > 0) {
      audioRef.current.play().catch(err => {
        console.error('Error auto-reproduciendo:', err);
        setIsPlaying(false);
      });
    }
  }, [currentSong, isPlaying, playlist]);

  // Estado de carga
  if (loading) {
    return (
      <div className="reproductor-principal">
        <div className="loading-music">
          <div className="disco-cargando">🎵</div>
          <p>Cargando nuestra música...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error && playlist.length === 0) {
    return (
      <div className="reproductor-principal">
        <div className="error-music">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Intentar de nuevo</button>
        </div>
      </div>
    );
  }

  const cancionActual = playlist[currentSong];

  return (
    <div className="reproductor-principal">
      {playlist.length > 0 && (
        <>
          <audio
            ref={audioRef}
            src={process.env.PUBLIC_URL + cancionActual.src}
            onEnded={nextSong}
            preload="metadata"
          />
          
          {/* Canción actual */}
        <div className="cancion-actual">
        <div className="imagen-disco">
    {cancionActual.image ? (
      <img 
        src={process.env.PUBLIC_URL + cancionActual.image} 
        alt={`Portada de ${cancionActual.title}`}
        className="imagen-album"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : null}
    <div className="disco-vinilo" style={{ display: cancionActual.image ? 'none' : 'flex' }}>
      🎵
    </div>
  </div>
  <div className="info-cancion">
    <h3>{cancionActual.title}</h3>
    <p>{cancionActual.artist}</p>
    {cancionActual.descripcion && (
      <p className="descripcion-cancion">{cancionActual.descripcion}</p>
    )}
  </div>
</div>

          {/* Controles */}
          <div className="controles-principales">
            <button onClick={prevSong} className="btn-control" title="Anterior">⏮️</button>
            <button onClick={togglePlayPause} className="btn-play" title={isPlaying ? 'Pausar' : 'Reproducir'}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={nextSong} className="btn-control" title="Siguiente">⏭️</button>
          </div>

          {/* Barra de progreso */}
          <div className="progreso-container">
            <span className="tiempo">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleProgressChange}
              className="barra-progreso-custom"
              title="Progreso de la canción"
            />
            <span className="tiempo">{formatTime(duration)}</span>
          </div>

          {/* Control de volumen */}
          <div className="volumen-container">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="barra-volumen"
              title="Control de volumen"
            />
          </div>

          {/* Lista de canciones */}
          <div className="lista-canciones">
            {playlist.map((song, index) => (
              <div
                key={song.id}
                onClick={() => selectSong(index)}
                className={`item-cancion ${index === currentSong ? 'activa' : ''}`}
                title={song.descripcion || `Reproducir ${song.title}`}
              >
                <span className="numero-cancion">{index + 1}</span>
                <div className="info-item">
                  <p className="titulo-item">{song.title}</p>
                  <p className="artista-item">{song.artist}</p>
                  {song.album && <p className="album-item">{song.album}</p>}
                </div>
                <span className="duracion-item">{song.duration}</span>
              </div>
            ))}
          </div>

          {/* Mostrar error si existe pero hay canciones cargadas */}
          {error && (
            <div className="error-mensaje">
              <small>⚠️ {error}</small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function App() {
  // Estados para el menú y navegación
  const [menuActivo, setMenuActivo] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
  const [progresoscroll, setProgresoScroll] = useState(0);
  
  // Estados para contador de días
  const [diasJuntos, setDiasJuntos] = useState(0);

  // Función para calcular días transcurridos
  const calcularDiasJuntos = () => {
    const fechaInicio = new Date('2023-09-19');
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diferencia / milisegundosPorDia);
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
                  no sería realidad, eso fue un () de junio tu ibas a ver barbie y yo oppenheimer, pero al final no habían boletas para ninguna de las dos
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
                <button className="favorito">💖</button>
                <h3>Los Primeros Días</h3>
                <p className="texto-historia">
                  Ay Dios mío como no olvidar los primeros días wow, ya hace más de dos años empezamos a hablar y ahora míranos aquí juntos 
                </p>
              </div>
              
              <div className="capitulo-historia">
                <button className="favorito">💖</button>
                <h3>Cuando Supimos que Era Especial</h3>
                <p className="texto-historia">
                  Ese momento en que ambos se dieron cuenta de que había algo único y especial entre ustedes...
                </p>
              </div>
              
              <div className="capitulo-historia">
                <button className="favorito">💖</button>
                <h3>Creciendo Juntos</h3>
                <p className="texto-historia">
                  Cómo han crecido como pareja, los retos superados, los momentos de felicidad compartidos...
                </p>
              </div>
              
              <div className="capitulo-historia">
                <button className="favorito">💖</button>
                <h3>El Presente</h3>
                <p className="texto-historia">
                  Dónde están ahora, qué significa esta relación para ambos, cómo se sienten después de dos años...
                </p>
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
                <button className="favorito">💖</button>
                <h3>Primera Cita</h3>
                <p>No sé si cuente como primera cita las veces que te acompañaba a música o cuando fuiste a mi cumple pero definitivamente
                    la primera primera fue el día que te llevé a comer sanchipapa, sé que fue mientras ya estábamos juntos
                    pero wow ver esos ojitos tuyos brillar por esa cita en serio me llenó tanto y fue simplemente la primera de muchas citas inolvidables en nuestra relación.
                </p>
              </div>
              <div className="tarjeta-momento">
                <button className="favorito">💖</button>
                <h3>Primer "Te Amo"</h3>
                <p>Descripción del momento...</p>
              </div>
              <div className="tarjeta-momento">
                <button className="favorito">💖</button>
                <h3>Primer Viaje Juntos</h3>
                <p>Descripción del momento...</p>
              </div>
              <div className="tarjeta-momento">
                <button className="favorito">💖</button>
                <h3>Primer Aniversario</h3>
                <p>Descripción del momento...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Galería */}
        <section id="galeria" className="seccion-galeria">
          <div className="contenedor">
            <h2 className="titulo-seccion">Nuestra Galería</h2>
            <div className="cuadricula-fotos">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="elemento-foto">
                  <img 
                    src={process.env.PUBLIC_URL + `/images/foto${num}.jpg`} 
                    alt={`Foto ${num}`} 
                    className="foto-galeria" 
                  />
                  <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
                  
                </div>
              ))}
              
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/barbie.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
              
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/RockThatBodyAmorcito.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
              
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/RockThatbodyYO.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
              
              <div className="elemento-foto">
                <img 
                  src={process.env.PUBLIC_URL + "/images/cumple flaca.jpg"} 
                  className="foto-galeria" 
                  alt="Cumpleaños" 
                />
                
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
              
              <div className="elemento-foto">
                <img 
                  src={process.env.PUBLIC_URL + "/images/carmen.jpg"} 
                  alt="Carmen" 
                  className="foto-galeria" 
                />
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
              
              <div className="elemento-foto">
                <video 
                  src={process.env.PUBLIC_URL + "/video/emmoji pop.mp4"} 
                  controls 
                  className="video-galeria"
                ></video>
                <button className="favorito"><span>💖</span>
                    <span>Agregar a favorito</span>
                  </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Reproductor de Música */}
        <section id="reproductor" className="seccion-musica">
          <div className="contenedor">
            <h2 className="titulo-seccion">Nuestra Música</h2>
            <MusicPlayer />
          </div>
        </section>
        
        {/* Timeline */}
        <section id="timeline" className="seccion-linea-tiempo">
          <div className="contenedor">
            <h2 className="titulo-seccion">Línea de Tiempo</h2>
            <div className="linea-tiempo">
              <div className="elemento-linea-tiempo">
                <div className="fecha-linea-tiempo">Septiembre 2023</div>
                <div className="contenido-linea-tiempo">
                  <h3>Nuestro Comienzo</h3>
                  <p>El día que todo empezó...</p>
                </div>
              </div>
              {/* Más eventos aquí */}
            </div>
          </div>
        </section>

        {/* Cartas */}
        <section id="cartas" className="seccion-cartas">
          <div className="contenedor">
            <h2 className="titulo-seccion">Cartas de Amor</h2>
            <div className="contenedor-cartas">
              <div className="carta">
                <h3>Para Ti, Mi Amor</h3>
                <p className="contenido-carta">
                  Aquí puedes escribir una carta especial para tu pareja...
                </p>
                <p className="firma-carta">Con todo mi amor, [Tu nombre]</p>
              </div>
            </div>
          </div>
        </section>

        {/* Planes */}
        <section id="planes" className="seccion-futuro">
          <div className="contenedor">
            <h2 className="titulo-seccion">Nuestros Planes Futuros</h2>
            <div className="contenido-planes">
              <div className="elemento-plan">
                <h3>Sueños Compartidos</h3>
                <p>Los sueños y metas que quieren alcanzar juntos...</p>
              </div>
              <div className="elemento-plan">
                <h3>Próximas Aventuras</h3>
                <p>Viajes, experiencias y aventuras que planean vivir...</p>
                <p>Actividades y metas que queremos lograr en el próximo año...</p>
              </div>
            </div>
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
    </div>
  );
}

export default App;