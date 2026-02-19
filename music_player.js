// --- Elements ---
const musicButton = document.getElementById("music_button");
const secondBox = document.getElementById("second_box");
const musicPanel = document.getElementById("music_panel");
const audioPlayer = document.getElementById("audio_player");
const playPauseButton = document.getElementById("play_pause");
const nextButton = document.getElementById("next_song");
const prevButton = document.getElementById("prev_song");
const songTitle = document.getElementById("song_title");
const noteIcon = document.getElementById("note");
const footer = document.querySelector(".footer");
const navBar = document.querySelector(".navbar");
const circle_walk = document.getElementById("circle_walk");
const darkOverlay= document.getElementById("dark_overlay");
const searchBar= document.getElementById("search_bar");
const page = document.getElementById("page");
const takeOnMeBg = document.getElementById("take_on_me_bg");
const timerIcon = document.getElementById("timerIcon");
const linkIcon = document.getElementById("link_icon");


// --- State ---
let isOpen = false;
let currentSongIndex = 0;
let characterHidden = false;
let petalInterval = null;
let frontPetalInterval = null;

// --- Songs ---
const songs = [
    "music_player/maplestory_ellinia_theme.mp3",
    "music_player/theme_of_hikari.mp3",
    "music_player/lumière.mp3",
    "music_player/go_picnic.mp3",
    "music_player/it's_just_so_chill.mp3",
    "music_player/une_vie_à_t'aimer.mp3",
    "music_player/proof_of_a_hero.mp3",
    "music_player/take_on_me.mp3"
];


const TakeOnMeConfig = {
    7: { startTime: 1 }
};

// --- Petal configs per song ---
const petalConfig = {
    2: { startTime: 1 }, // lumière
    5: { startTime: 46 }  // Une vie à t’aimer
};

// --- Open / Close Player ---
const floatingBoxes = document.querySelectorAll(".floating_box");

floatingBoxes.forEach(box => {
    box.addEventListener("click", (e) => {
        e.stopPropagation();

        // close others (optional, but nice)
        floatingBoxes.forEach(b => {
            if (b !== box) b.classList.remove("open");
        });

        // toggle this one
        box.classList.toggle("open");
    });
});

// click outside closes ALL
document.addEventListener("click", () => {
    floatingBoxes.forEach(box => box.classList.remove("open"));
});

musicPanel.addEventListener("click", (event) => event.stopPropagation());

const timerPanel = document.getElementById("timer_panel");
if (timerPanel) timerPanel.addEventListener("click", (event) => event.stopPropagation());



// --- Normal Petals ---
function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.style.left = Math.random() * window.innerWidth + "px";
    const size = 2 + Math.random() * 10;
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    const colors = ["#bb1616", "#ff8fa3", "#ffffff", "#3b0c0c"];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = 7 + Math.random() * 10;
    petal.style.animationDuration = duration + "s";
    const rotation = Math.random() * 360;
    petal.style.transform = `rotate(${rotation}deg)`;
    const drift = (Math.random() - 1) * 100;
    petal.style.setProperty("--drift", `${drift}px`);
    petal.style.animationName = "fall";
    petal.style.zIndex = 1000; // Normal layer

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 2000);
}

function startPetals() {
    if (!petalInterval) petalInterval = setInterval(createPetal, 10);

        // Darken background
        if (darkOverlay) darkOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
}

function stopPetals() {
    clearInterval(petalInterval);
    petalInterval = null;
    // Return background to normal
    if (darkOverlay) darkOverlay.style.backgroundColor = "rgba(0,0,0,0)";
}

// --- Front Layer Petals ---
function createFrontPetal() {
    const petal = document.createElement("div");
    petal.classList.add("front-petal");
    petal.style.left = Math.random() * window.innerWidth + "px";
    const size = 2 + Math.random() * 8;
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    const colors = ["#ff5c5c", "#ffb3b3", "#ffffff"];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = 7 + Math.random() * 7;
    petal.style.animationDuration = duration + "s";
    const rotation = Math.random() * 360;
    petal.style.transform = `rotate(${rotation}deg)`;
    petal.style.animationName = "fall";
    petal.style.zIndex = 2000; // Front layer


    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 2000);
}

function startFrontPetals() {
    if (!frontPetalInterval) frontPetalInterval = setInterval(createFrontPetal, 300); // sparser
}

function stopFrontPetals() {
    clearInterval(frontPetalInterval);
    frontPetalInterval = null;
}

function updateGrayscale() {
    const cfg = TakeOnMeConfig[currentSongIndex];

    if (!cfg) {
        document.body.classList.remove("take_on_me");
        if (takeOnMeBg) {
            takeOnMeBg.pause();
            takeOnMeBg.currentTime = 0;
        }
        return;
    }

    if (audioPlayer.currentTime >= cfg.startTime) {
        document.body.classList.add("take_on_me");
        if (takeOnMeBg && takeOnMeBg.paused) {
            // try to sync video to audio (optional)
            takeOnMeBg.currentTime = audioPlayer.currentTime - cfg.startTime;
            takeOnMeBg.play().catch(() => {});
        }
    } else {
        document.body.classList.remove("take_on_me");
        if (takeOnMeBg) {
            takeOnMeBg.pause();
            takeOnMeBg.currentTime = 0;
        }
    }
}



// --- Load Song ---
function loadSong(index, autoPlay = false) {
    currentSongIndex = index;
    audioPlayer.src = songs[index];
    audioPlayer.load();
    updateGrayscale();

    // Update song title
    const fileName = songs[index].split("/").pop().replace(".mp3", "").replaceAll("_", " ");
    songTitle.textContent = fileName;

    // Reset walking character
    if (![2,5].includes(index) && circle_walk) {
        circle_walk.style.display = "block";
        characterHidden = false;
    }

    // Stop petals
    stopPetals();
    stopFrontPetals();

    // Update play/pause icon
    const img = playPauseButton.querySelector("img");
    img.src = autoPlay ? "music_player/pause.png" : "music_player/play.png";

    if (autoPlay) {
        audioPlayer.play();
        noteIcon.classList.add("playing");
        musicButton.classList.add("playing");
        footer.classList.add("playing");
        navBar.classList.add("playing");
        linkIcon.classList.add("playing");
        secondBox.classList.add("playing");
        timerIcon.classList.add("playing");
        
    } else {
        noteIcon.classList.remove("playing");
        musicButton.classList.remove("playing");
        footer.classList.remove("playing");
        navBar.classList.remove("playing");
        linkIcon.classList.remove("playing");
        secondBox.classList.remove("playing");
        timerIcon.classList.remove("playing");
    }
}

// --- Play / Pause ---
playPauseButton.addEventListener("click", () => {
    const img = playPauseButton.querySelector("img");
    if (audioPlayer.paused) {
        audioPlayer.play();
        img.src = "music_player/pause.png";
        noteIcon.classList.add("playing");
        musicButton.classList.add("playing");
        footer.classList.add("playing");
        navBar.classList.add("playing");
        secondBox.classList.add("playing");
        timerIcon.classList.add("playing");
    } else {
        audioPlayer.pause();
        img.src = "music_player/play.png";
        stopPetals();
        stopFrontPetals();
        noteIcon.classList.remove("playing");
        musicButton.classList.remove("playing");
        footer.classList.remove("playing");
        navBar.classList.remove("playing");
        secondBox.classList.remove("playing");
        timerIcon.classList.remove("playing");
    }
});

// --- next / Previous ---
nextButton.addEventListener("click", () => loadSong((currentSongIndex + 1) % songs.length, true));
prevButton.addEventListener("click", () => loadSong((currentSongIndex - 1 + songs.length) % songs.length, true));

// --- Auto-next ---
audioPlayer.addEventListener("ended", () => loadSong((currentSongIndex + 1) % songs.length, true));

// --- Time-based effects ---
audioPlayer.addEventListener("timeupdate", () => {
    const config = petalConfig[currentSongIndex];
    if (config && audioPlayer.currentTime >= config.startTime) {
        startPetals();
        startFrontPetals();
    } else {
        stopPetals();
        stopFrontPetals();
    }
    updateGrayscale();

    // Hide walking character
    if (!characterHidden && circle_walk && [2,5].includes(currentSongIndex)) {
        circle_walk.style.display = "none";
        characterHidden = true;
    }
});

// --- Initial Setup ---
loadSong(currentSongIndex, false);

// --- Walking character click ---
if (circle_walk) {
    circle_walk.addEventListener("click", () => {
        circle_walk.style.animationPlayState = "paused";
        circle_walk.src = "pictures/animation/circle_death.gif";
        circle_walk.style.pointerEvents = "none";
        setTimeout(() => circle_walk.remove(), 1000);
    });
}
