const audioContext = new AudioContext();
const musicElement = document.getElementById("music");
// pass it into the audio context
var track = audioContext.createMediaElementSource(musicElement);
track.connect(audioContext.destination);

const countdownElement = document.getElementById("countdown");
var track2 = audioContext.createMediaElementSource(countdownElement);
track2.connect(audioContext.destination);

const jumpElement = document.getElementById("jump");
var track3 = audioContext.createMediaElementSource(jumpElement);
track3.connect(audioContext.destination);

const gameOverElement = document.getElementById("gameover");
var track4 = audioContext.createMediaElementSource(gameOverElement);
track4.connect(audioContext.destination);

const winElement = document.getElementById("win");
var track5 = audioContext.createMediaElementSource(winElement);
track5.connect(audioContext.destination);
;
musicElement.addEventListener(
  "ended",
  () => {
    // loop music
    musicElement.currentTime = 0;
    musicElement.play();
  },
  false,
);

addEventListener(
  "StartGame",
  (e) => {
    if (countdownElement.src.includes("none")) {
      return
    }
    countdownElement.pause();
    countdownElement.currentTime = 0;
    countdownElement.play();
  }
);


addEventListener(
  "StartMove",
  (e) => {
    if (musicElement.src.includes("none")) {
      return
    }
    musicElement.pause();
    musicElement.currentTime = e.detail;
    musicElement.playbackRate = 1;
    musicElement.play();
  }
);
addEventListener(
  "jump",
  () => {
    if (jumpElement.src.includes("none")) {
      return
    }
    jumpElement.pause();
    jumpElement.currentTime = 0;
	musicElement.volume = 0.9;
    jumpElement.play();

  }
)

jumpElement.addEventListener(
  "ended",
  () => {
	musicElement.volume = 1;
  },
  false,
);

addEventListener("GameOver",
  () => {
    musicElement.playbackRate = 1;
    musicElement.pause();
    gameOverElement.currentTime = 0;
    gameOverElement.play()
  }
);

addEventListener("Death",
  () => {
    musicElement.playbackRate = 1;
    musicElement.pause();
  }
);


addEventListener("Win",
    () => {
        musicElement.pause();
        winElement.currentTime= 0;
        winElement.play();
    }
);

