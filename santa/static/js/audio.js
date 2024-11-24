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

musicFile.onchange = function() {
  var files = this.files;
  var file = URL.createObjectURL(files[0]);
  musicElement.src = file;
};

countdownFile.onchange = function() {
  var files = this.files;
  var file = URL.createObjectURL(files[0]);
  countdownElement.src = file;
};


jumpFile.onchange = function() {
  var files = this.files;
  var file = URL.createObjectURL(files[0]);
  jumpElement.src = file;
};
// Select our play button
// const playButton = document.getElementById("audioButton");

//playButton.addEventListener(
//  "click",
//  () => {
//    // Check if context is in suspended state (autoplay policy)
//    if (audioContext.state === "suspended") {
//      audioContext.resume();
//    }
//
//    // Play or pause track depending on state
//    if (playButton.dataset.playing === "false") {
//      console.log("playig");
//      musicElement.play();
//      playButton.dataset.playing = "true";
//    } else if (playButton.dataset.playing === "true") {
//      musicElement.pause();
//      playButton.dataset.playing = "false";
//    }
//  },
//  false,
//);/


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

addEventListener("SpeedUp",
  (e) => {
    let speed = e.detail;
    musicElement.playbackRate = speed;
  }
);
addEventListener("GameOver",
  () => {
    musicElement.playbackRate = 1;
    musicElement.pause();
  }
);

addEventListener("Death",
  () => {
    musicElement.playbackRate = 1;
    musicElement.pause();
  }
);


