const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
});

const videos = document.querySelectorAll('.carousel-video');
const fills = document.querySelectorAll('.progress-fill');
const playPauseBtn = document.getElementById('playPauseBtn');
const icon = playPauseBtn.querySelector('i');
const carousel = document.getElementById('carousel');

let currentIndex = 0;
let isPlaying = true;
let isScrolling = false; 

// Start first video
videos[currentIndex].play();

function showVideo(index) {
    videos.forEach((vid, i) => {
        vid.classList.remove('active');
        fills[i].style.width = '0%';
        if (i === index) {
            vid.classList.add('active');
            vid.currentTime = 0;
            if (isPlaying) vid.play();
        } else {
            vid.pause();
        }
    });
}

// Track duration for the Rockstar Progress Bars
videos.forEach((vid, index) => {
    vid.addEventListener('timeupdate', () => {
        if (vid.classList.contains('active')) {
            const percentage = (vid.currentTime / vid.duration) * 100;
            fills[index].style.width = percentage + '%';
        }
    });
    // Auto-play next video when finished
    vid.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % videos.length;
        showVideo(currentIndex);
    });
});

// Play / Pause Icon toggle
playPauseBtn.addEventListener('click', () => {
    const activeVid = videos[currentIndex];
    if (isPlaying) {
        activeVid.pause();
        icon.classList.replace('fa-pause', 'fa-play');
    } else {
        activeVid.play();
        icon.classList.replace('fa-play', 'fa-pause');
    }
    isPlaying = !isPlaying;
});

// --- MOBILE SWIPE LOGIC ---
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
        // Swiped Left - Next Video
        currentIndex = (currentIndex + 1) % videos.length;
        showVideo(currentIndex);
    }
    if (touchEndX - touchStartX > threshold) {
        // Swiped Right - Previous Video
        currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        showVideo(currentIndex);
    }
}

// --- PC MOUSE WHEEL SCROLL LOGIC ---
carousel.addEventListener('wheel', (e) => {
    if (isScrolling) return; 
    isScrolling = true; // Prevents skipping 10 videos in one scroll

    if (e.deltaY > 0) {
        // Scrolled Down - Next Video
        currentIndex = (currentIndex + 1) % videos.length;
        showVideo(currentIndex);
    } else if (e.deltaY < 0) {
        // Scrolled Up - Previous Video
        currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        showVideo(currentIndex);
    }

    // Wait 1 second before allowing the user to scroll to the next video again
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}, {passive: true});

