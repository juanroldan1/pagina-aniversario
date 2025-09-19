import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Componente MusicPlayer (se mantiene igual)
const MusicPlayer = ({ favoritos, toggleFavorito, esFavorito }) => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const BotonFavoritoMusica = ({ cancion }) => {
    const isFav = esFavorito(`cancion-${cancion.id}`);
    
    return (
      <button
        onClick={() => toggleFavorito({
          id: `cancion-${cancion.id}`,
          tipo: 'cancion',
          titulo: cancion.title,
          artista: cancion.artist,
          descripcion: cancion.descripcion || 'Una de nuestras canciones especiales',
          src: cancion.src,
          image: cancion.image
        })}
        className={`favorito ${isFav ? 'activo' : ''}`}
        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        style={{ fontSize: '12px', padding: '4px 8px' }}
      >
        <span>{isFav ? '❤️' : '🤍'}</span>
      </button>
    );
  };

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
            <div style={{ marginLeft: 'auto' }}>
              <BotonFavoritoMusica cancion={cancionActual} />
            </div>
          </div>

          <div className="controles-principales">
            <button onClick={prevSong} className="btn-control" title="Anterior">⏮️</button>
            <button onClick={togglePlayPause} className="btn-play" title={isPlaying ? 'Pausar' : 'Reproducir'}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={nextSong} className="btn-control" title="Siguiente">⏭️</button>
          </div>

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
                <BotonFavoritoMusica cancion={song} />
              </div>
            ))}
          </div>

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

// NUEVO: Componente para la pantalla de favoritos
const FavoritosScreen = ({ favoritos, toggleFavorito, onCerrar }) => {
  return (
    <div className="favoritos-modal">
      <div className="favoritos-contenido">
        <button className="boton-cerrar" onClick={onCerrar}>❌</button>
        <h2 className="titulo-seccion">Tus Favoritos</h2>
        {favoritos.length === 0 ? (
          <p className="no-favoritos">Aún no tienes favoritos. ❤️</p>
        ) : (
          <div className="lista-favoritos">
            {favoritos.sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado)).map(fav => (
              <div key={fav.id} className="item-favorito">
                <div className="info-favorito">
                  {fav.tipo === 'foto' && fav.src && (
                    <img src={process.env.PUBLIC_URL + fav.src} alt={fav.titulo} className="miniatura-favorito" />
                  )}
                  {fav.tipo === 'video' && fav.src && (
                    <video src={process.env.PUBLIC_URL + fav.src} className="miniatura-favorito" />
                  )}
                  {fav.tipo === 'cancion' && fav.image && (
                    <img src={process.env.PUBLIC_URL + fav.image} alt={fav.titulo} className="miniatura-favorito" />
                  )}
                  <div className="texto-favorito">
                    <h3>{fav.titulo}</h3>
                    <p>{fav.descripcion}</p>
                    <small>Tipo: {fav.tipo}</small>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorito(fav)}
                  className="boton-quitar"
                  title="Quitar de favoritos"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal de la aplicación (App)
function App() {
  const [menuActivo, setMenuActivo] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
  const [progresoscroll, setProgresoScroll] = useState(0);
  
  const [diasJuntos, setDiasJuntos] = useState(0);
  const [diasDesde2024, setDiasDesde2024] = useState(0);

  // ESTADO NUEVO: para gestionar la visibilidad de la pantalla de favoritos
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  
  // ESTADO NUEVO: para gestionar la lista de favoritos
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const favoritosGuardados = localStorage.getItem('favoritos');
      return favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
    } catch (e) {
      console.error("Error al cargar favoritos de localStorage", e);
      return [];
    }
  });

  // EFECTO NUEVO: para guardar favoritos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    } catch (e) {
      console.error("Error al guardar favoritos en localStorage", e);
    }
  }, [favoritos]);

  const calcularDiasJuntos = () => {
    const fechaInicio = new Date('2023-09-19');
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diferencia / milisegundosPorDia);
  };

  const calculardesde2024 = () => {
    const fechaInicio = new Date('2024-09-19');
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diferencia / milisegundosPorDia);
  };

  const toggleFavorito = (item) => {
    setFavoritos(prevFavoritos => {
      const yaEsFavorito = prevFavoritos.find(fav => fav.id === item.id);
      
      if (yaEsFavorito) {
        return prevFavoritos.filter(fav => fav.id !== item.id);
      } else {
        return [...prevFavoritos, { ...item, fechaAgregado: new Date().toISOString() }];
      }
    });
  };

  const esFavorito = (itemId) => {
    return favoritos.some(fav => fav.id === itemId);
  };

  const BotonFavorito = ({ item, className = "" }) => {
    const isFav = esFavorito(item.id);
    
    return (
      <button
        onClick={() => toggleFavorito(item)}
        className={`favorito ${isFav ? 'activo' : ''} ${className}`}
        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <span>{isFav ? '❤️' : '🤍'}</span>
        <span>{isFav ? 'Ya es favorito' : 'Agregar a favorito'}</span>
      </button>
    );
  };

  const scrollSuave = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setMenuActivo(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeaderScrolled(scrollY > 50);
      setMostrarBotonArriba(scrollY > 300);
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      const progreso = (scrollY / alturaTotal) * 100;
      setProgresoScroll(progreso);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDiasJuntos(calcularDiasJuntos());
    const interval = setInterval(() => {
      setDiasJuntos(calcularDiasJuntos());
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDiasDesde2024(calculardesde2024());
    const interval = setInterval(() => {
      setDiasDesde2024(calculardesde2024());
    }, 3600000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div 
        className="indicador-scroll" 
        style={{ width: `${progresoscroll}%` }}
      />

      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <nav className="barra-navegacion">
          <div className="marca-navegacion">
            <h1 onClick={() => { scrollToTop(); setMostrarFavoritos(false); }}>Thogeder💖</h1>
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
            <li>
              <button onClick={() => { setMostrarFavoritos(!mostrarFavoritos); setMenuActivo(false); }} className="boton-favoritos-nav">
                ❤️ ({favoritos.length})
              </button>
            </li>
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

      {mostrarFavoritos ? (
        <FavoritosScreen
          favoritos={favoritos}
          toggleFavorito={toggleFavorito}
          onCerrar={() => setMostrarFavoritos(false)}
        />
      ) : (
        <main>
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
                  <BotonFavorito 
                    item={{
                      id: 'historia-primer-encuentro',
                      tipo: 'historia',
                      titulo: 'El Primer Encuentro',
                      descripcion: 'El 26 de julio que fui a cine, no vi barbie ni oppenheimer, pero te conocí'
                    }} 
                    className="solo-icono"
                  />
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
                      tipo: 'historia',
                      titulo: 'Los Primeros Días',
                      descripcion: 'Como no olvidar los primeros días wow, ya hace más de dos años empezamos a hablar y ahora míranos aquí juntos'
                    }} 
                    className="solo-icono"
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
                      tipo: 'historia',
                      titulo: 'Cuando Supimos que Era Especial',
                      descripcion: 'El dia que supimos que era especial fue el dia del terremoto, yo decia yo no me voy a preocupar por nadie y literal ese dia yo todo preocupado'
                    }} 
                    className="solo-icono"
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
                      tipo: 'historia',
                      titulo: 'Creciendo Juntos',
                      descripcion: 'Hemos tenido demasiados momentos sabes, momentos lindos, momentos no tan lindos pero siempre persiste el amor'
                    }} 
                    className="solo-icono"
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
                      tipo: 'historia',
                      titulo: 'El Presente',
                      descripcion: 'Ahora siento que somos una relacion mucho mas madura de lo que eramos hace dos años flaca, hemos crecido tanto'
                    }} 
                    className="solo-icono"
                  />
                </div>
              </div>
            </div>
          </section>

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
                    className="solo-icono"
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
                    className="solo-icono"
                  />
                </div>

                <div className="tarjeta-momento">
                  <h3>Primer Aniversario</h3>
                  <p>Nuestro primer añito que fue hace {diasDesde2024} dias pero wow que aventuras amorcito que experiencias
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
                    className="solo-icono"
                  />
                </div>
              </div>
            </div>
          </section>

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
                    <BotonFavorito 
                      item={{
                        id: `foto-${num}`,
                        tipo: 'foto',
                        titulo: `Nuestra foto ${num}`,
                        descripcion: `fotito ${num}`,
                        src: `/images/foto${num}.jpg`
                      }} 
                    />
                  </div>
                ))}
                
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
                      descripcion: 'Que verguenza',
                      src: '/video/barbie.mp4'
                    }} 
                  />
                </div>
                
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
                      descripcion: 'Tu rock your body',
                      src: '/video/RockThatBodyAmorcito.mp4'
                    }} 
                  />
                </div>
                
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
                      descripcion: 'Mi intento de bailar jajaja',
                      src: '/video/RockThatbodyYO.mp4'
                    }} 
                  />
                </div>
                
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
                      descripcion: 'Celebrando a la persona más especial',
                      src: '/images/cumple flaca.jpg'
                    }}
                  />
                </div>
                
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
                      titulo: 'Carmencita',
                      descripcion: 'Qué foto tan linda',
                      src: '/images/carmen.jpg'
                    }}
                  />
                </div>
                
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
                      titulo: 'Video Emojis',
                      descripcion: 'Cuando nos vimos jajaja',
                      src: '/video/emmoji pop.mp4'
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="reproductor" className="seccion-musica">
            <div className="contenedor">
              <h2 className="titulo-seccion">Nuestra Música</h2>
              <MusicPlayer
                favoritos={favoritos}
                toggleFavorito={toggleFavorito}
                esFavorito={esFavorito}
              />
            </div>
          </section>
        </main>
      )}
      
      <footer>
        <div className="contenedor">
          <div className="contenido-pie">
            <p className="frase-amor">"Es tan natural querer amarnos"</p>
            <p className="texto-pie">Como sea yo te amo</p>
          </div>
        </div>
      </footer>

      {mostrarBotonArriba && (
        <button className="boton-arriba" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default App;