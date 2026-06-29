document.addEventListener('DOMContentLoaded', () => {
  const headerToggle = document.querySelector('.header-toggle');
  const header = document.querySelector('#header');

  if (!headerToggle || !header) return;

  function toggleHeader() {
    header.classList.toggle('header-show');
    headerToggle.classList.toggle('bi-list');
    headerToggle.classList.toggle('bi-x');
  }

  headerToggle.addEventListener('click', toggleHeader);

  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (header.classList.contains('header-show')) {
        toggleHeader();
      }
    });
  });
});


const music = document.getElementById('bgMusic');
  const STORAGE_KEY = 'bgMusicState';

  function saveMusicState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      time: music.currentTime,
      playing: !music.paused
    }));
  }

  function restoreMusicState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const state = JSON.parse(saved);
    music.currentTime = state.time;

    if (state.playing) {
      music.play().catch(() => {
        document.body.addEventListener('click', () => music.play(), { once: true });
      });
    }
  }

  function playMusic() {
    if (music.paused) {
      music.play();
    } else {
      music.pause();
    }
  }

  restoreMusicState();

  setInterval(saveMusicState, 1000);

  window.addEventListener('beforeunload', saveMusicState);

  document.querySelectorAll('a').forEach(link => {
    if (link.hostname === window.location.hostname || link.getAttribute('href')?.endsWith('.html')) {
      link.addEventListener('click', saveMusicState);
    }
  });