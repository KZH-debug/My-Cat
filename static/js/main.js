// Hamburger Menu Animation
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
});

// Video Carousel Logic
const videos = document.querySelectorAll('.carousel-video');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function showVideo(index) {
    videos.forEach((vid, i) => {
        vid.classList.remove('active');
        if (i === index) {
            vid.classList.add('active');
            vid.play();
        } else {
            vid.pause();
            vid.currentTime = 0;
        }
    });
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % videos.length;
    showVideo(currentIndex);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + videos.length) % videos.length;
    showVideo(currentIndex);
});

