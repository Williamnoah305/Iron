// DARK MODE TOGGLE
const body = document.body;
const toggleBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('iron-theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = '☀';
}

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    toggleBtn.textContent = isDark ? '☀' : '☾';
    localStorage.setItem('iron-theme', isDark ? 'dark' : 'light');
});

// PARALLAX SCROLL
const layers = document.querySelectorAll('.parallax-layer');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed || '0.2');
        const yPos = -(scrollTop * speed);
        layer.style.backgroundPosition = `center ${yPos}px`;
    });
});

// MUSIC-REACTIVE BACKGROUND
const audio = document.getElementById('music-audio');
const musicSection = document.querySelector('.section-music');

if (audio && window.AudioContext) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    let sourceNode;
    let dataArray = new Uint8Array(analyser.frequencyBinCount);

    const connectAudio = () => {
        if (!sourceNode) {
            sourceNode = audioContext.createMediaElementSource(audio);
            sourceNode.connect(analyser);
            analyser.connect(audioContext.destination);
        }
    };

    const animateReactive = () => {
        requestAnimationFrame(animateReactive);
        analyser.getByteFrequencyData(dataArray);
        const avg =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (avg > 80) {
            musicSection.classList.add('reactive');
        } else {
            musicSection.classList.remove('reactive');
        }
    };

    audio.addEventListener('play', async () => {
        await audioContext.resume();
        connectAudio();
        animateReactive();
    });
}
