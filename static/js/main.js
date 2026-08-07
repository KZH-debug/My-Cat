document.addEventListener('DOMContentLoaded', () => {
    // 1. Hamburger Menu Animation Toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
        });
    }

    // 2. Video Carousel & Progress Bars Logic
    const videos = document.querySelectorAll('.carousel-video');
    const fills = document.querySelectorAll('.progress-fill');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (videos.length === 0) return;

    let currentIndex = 0;
    let videoDuration = 6000;
    let startTime = null;
    let animationFrameId = null;
    let isPlaying = true;
    let elapsedPausedTime = 0;

    function setVideoDuration() {
        if (videos[currentIndex].duration && !isNaN(videos[currentIndex].duration)) {
            videoDuration = videos[currentIndex].duration * 1000;
        } else {
            videoDuration = 6000;
        }
    }

    function showVideo(index) {
        videos.forEach((vid, i) => {
            vid.classList.remove('active');
            vid.pause();
            vid.currentTime = 0;
            if (fills[i]) fills[i].style.width = '0%';
        });

        currentIndex = index;
        videos[currentIndex].classList.add('active');
        
        if (isPlaying) {
            videos[currentIndex].play().catch(e => console.log("Autoplay blocked:", e));
        }

        setVideoDuration();
        startTime = performance.now();
        elapsedPausedTime = 0;
        if (isPlaying) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(updateCarousel);
        }
    }

    function updateCarousel(timestamp) {
        if (!isPlaying) return;

        if (!startTime) startTime = timestamp;
        let elapsed = (timestamp - startTime) + elapsedPausedTime;
        let progress = Math.min((elapsed / videoDuration) * 100, 100);

        if (fills[currentIndex]) {
            fills[currentIndex].style.width = progress + '%';
        }

        for (let i = 0; i < currentIndex; i++) {
            if (fills[i]) fills[i].style.width = '100%';
        }

        if (elapsed < videoDuration) {
            animationFrameId = requestAnimationFrame(updateCarousel);
        } else {
            let nextIndex = (currentIndex + 1) % videos.length;
            showVideo(nextIndex);
        }
    }

    videos[currentIndex].addEventListener('loadedmetadata', () => {
        setVideoDuration();
    });

    showVideo(currentIndex);

    // Play / Pause Toggle
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            const icon = playPauseBtn.querySelector('i');

            if (isPlaying) {
                if (icon) icon.className = "fa-solid fa-pause";
                videos[currentIndex].play();
                startTime = performance.now();
                animationFrameId = requestAnimationFrame(updateCarousel);
            } else {
                if (icon) icon.className = "fa-solid fa-play";
                videos[currentIndex].pause();
                cancelAnimationFrame(animationFrameId);
                if (startTime) {
                    elapsedPausedTime += performance.now() - startTime;
                }
                startTime = null;
            }
        });
    }

    // Touch and Mouse Swipe Navigation Support
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.getElementById('carousel');

    if (carousel) {
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            let nextIndex = (currentIndex + 1) % videos.length;
            showVideo(nextIndex);
        }
        if (touchEndX > touchStartX + threshold) {
            let prevIndex = (currentIndex - 1 + videos.length) % videos.length;
            showVideo(prevIndex);
        }
    }
});

