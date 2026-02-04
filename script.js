// Base de datos de podcasts - MODIFICA AQUÍ TU CONTENIDO
const podcastsDatabase = [
    {
        id: 1,
        title: "Tu Podcast Personal",
        author: "Tu Nombre",
        description: "Reemplaza este texto con la descripción de tu podcast. Sube tu archivo MP3 y personaliza toda la información.",
        category: "entretenimiento",
        audioUrl: "mi-podcast.mp3", // CAMBIA POR EL NOMBRE DE TU ARCHIVO
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: "3:45",
        date: "15 Ene 2024",
        plays: 1
    },
    {
        id: 2,
        title: "Comunicado Interno Enero 2024",
        author: "Dirección General",
        description: "Mensaje importante sobre las nuevas políticas institucionales y cambios organizacionales.",
        category: "comunicacion",
        audioUrl: "https://ejemplo.com/audio/comunicado-enero.mp3",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: "8:20",
        date: "12 Ene 2024",
        plays: 342
    },
    {
        id: 3,
        title: "Capacitación en Seguridad Informática",
        author: "Departamento de Tecnología",
        description: "Guía completa sobre políticas de seguridad, manejo de contraseñas y protección de datos.",
        category: "capacitacion",
        audioUrl: "https://ejemplo.com/audio/seguridad-informatica.mp3",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        duration: "18:15",
        date: "10 Ene 2024",
        plays: 178
    }
];

// Variables del sistema
let podcasts = [...podcastsDatabase];
let filteredPodcasts = [...podcasts];
const audioPlayer = new Audio();
let currentPodcastIndex = 0;
let isPlaying = false;
let currentFilter = 'todos';

// Inicializar la aplicación
function init() {
    renderPodcasts();
    setupAudioPlayer();
    updateLastUpdateDate();

    // Reproducir el primer podcast automáticamente
    setTimeout(() => {
        if (podcasts.length > 0) {
            selectPodcast(0);
        }
    }, 1000);
}

// Renderizar lista de podcasts
function renderPodcasts() {
    const grid = document.getElementById('podcastsGrid');
    grid.innerHTML = '';

    filteredPodcasts.forEach((podcast, index) => {
        const card = document.createElement('div');
        card.className = 'podcast-card';
        
        // Marcar como activo si es el que se está reproduciendo
        const originalIndex = podcasts.findIndex(p => p.id === podcast.id);
        if (originalIndex === currentPodcastIndex) {
            card.classList.add('active');
        }

        card.innerHTML = `
            ${originalIndex === currentPodcastIndex ? 
                '<div class="now-playing">EN REPRODUCCIÓN</div>' : ''}
            <img src="${podcast.imageUrl}" alt="${podcast.title}" class="card-image">
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <div class="card-title">${podcast.title}</div>
                        <div class="card-category">${podcast.category.toUpperCase()}</div>
                    </div>
                </div>
                <div class="card-author">Por: ${podcast.author}</div>
                <p class="card-description">${podcast.description}</p>
                <div class="card-footer">
                    <span><i class="far fa-clock"></i> ${podcast.duration}</span>
                    <span><i class="far fa-calendar"></i> ${podcast.date}</span>
                    <span><i class="fas fa-headphones"></i> ${podcast.plays} reproducciones</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            const podIndex = podcasts.findIndex(p => p.id === podcast.id);
            selectPodcast(podIndex);
        });
        
        grid.appendChild(card);
    });
}

// Filtrar podcasts por categoría
function filterPodcasts(category) {
    currentFilter = category;

    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    if (category === 'todos') {
        filteredPodcasts = [...podcasts];
    } else {
        filteredPodcasts = podcasts.filter(podcast => podcast.category === category);
    }

    renderPodcasts();
}

// Configurar reproductor de audio
function setupAudioPlayer() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', nextTrack);
    audioPlayer.addEventListener('error', handleAudioError);

    // Configurar volumen inicial
    audioPlayer.volume = document.getElementById('volumeSlider').value / 100;
}

// Manejar errores de audio
function handleAudioError() {
    console.error('Error al cargar el audio');
    alert('Error: No se pudo cargar el archivo de audio. Verifica que el archivo MP3 esté en la misma carpeta y se llame "mi-podcast.mp3"');
}

// Seleccionar podcast para reproducir
function selectPodcast(index) {
    currentPodcastIndex = index;
    const podcast = podcasts[index];

    // Actualizar interfaz del reproductor
    document.getElementById('playerTitle').textContent = podcast.title;
    document.getElementById('playerAuthor').textContent = `Por: ${podcast.author}`;
    document.getElementById('playerDescription').textContent = podcast.description;
    document.getElementById('playerCover').src = podcast.imageUrl;
    document.getElementById('playerCategory').textContent = podcast.category.toUpperCase();

    // Actualizar lista visualmente
    renderPodcasts();

    // Cargar y reproducir audio
    audioPlayer.src = podcast.audioUrl;
    
    // Intentar cargar el audio
    audioPlayer.load();
    
    // Incrementar contador de reproducciones
    podcast.plays++;

    // Actualizar botón de play
    const playBtn = document.getElementById('playBtn');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    document.getElementById('mainPlayer').classList.add('playing');

    // Reproducir automáticamente
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Reproducción automática bloqueada:', error);
            // Si hay error, solo actualizamos el botón pero no paramos
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            document.getElementById('mainPlayer').classList.remove('playing');
        });
    }
}

// Controles del reproductor
function togglePlay() {
    const playBtn = document.getElementById('playBtn');

    if (isPlaying) {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('mainPlayer').classList.remove('playing');
    } else {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('mainPlayer').classList.add('playing');
                isPlaying = true;
            }).catch(error => {
                console.log('Error al reproducir:', error);
                alert('No se pudo reproducir el audio. Verifica que el archivo MP3 esté en la misma carpeta.');
            });
        }
    }
}

function previousTrack() {
    if (currentPodcastIndex > 0) {
        selectPodcast(currentPodcastIndex - 1);
    }
}

function nextTrack() {
    if (currentPodcastIndex < podcasts.length - 1) {
        selectPodcast(currentPodcastIndex + 1);
    }
}

function toggleMute() {
    const muteBtn = document.getElementById('muteBtn');
    audioPlayer.muted = !audioPlayer.muted;

    if (audioPlayer.muted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function changeVolume(value) {
    audioPlayer.volume = value / 100;
}

function seekAudio(event) {
    const progressContainer = event.currentTarget;
    const clickPosition = event.offsetX;
    const containerWidth = progressContainer.clientWidth;
    const percentage = (clickPosition / containerWidth);

    if (audioPlayer.duration) {
        audioPlayer.currentTime = audioPlayer.duration * percentage;
    }
}

// Actualizar barra de progreso
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');

    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
}

function updateDuration() {
    const duration = document.getElementById('duration');
    if (audioPlayer.duration) {
        duration.textContent = formatTime(audioPlayer.duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Actualizar fecha de último cambio
function updateLastUpdateDate() {
    const lastUpdate = document.getElementById('lastUpdate');
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    lastUpdate.textContent = now.toLocaleDateString('es-ES', options);
}

// Función para agregar nuevos podcasts fácilmente
function addNewPodcast(newPodcast) {
    // Agregar al inicio del array
    podcasts.unshift({
        id: podcasts.length + 1,
        ...newPodcast
    });

    // Actualizar la base de datos
    podcastsDatabase.unshift({
        id: podcasts.length + 1,
        ...newPodcast
    });

    // Actualizar interfaz
    renderPodcasts();

    // Si es el primer podcast, seleccionarlo
    if (podcasts.length === 1) {
        selectPodcast(0);
    }
}

// PARA AGREGAR TU PODCAST PERSONAL:
// 1. Sube tu archivo MP3 a la misma carpeta
// 2. Modifica el primer objeto en podcastsDatabase (líneas 4-16)
// 3. Cambia audioUrl por el nombre de tu archivo: "NOMBRE_DEL_ARCHIVO.mp3"

// Inicializar la aplicación cuando se cargue la página
document.addEventListener('DOMContentLoaded', init);