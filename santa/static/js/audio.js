const audioContext = new AudioContext();
const musicElement = document.getElementById("music");
// pass it into the audio context
var track = audioContext.createMediaElementSource(musicElement);
track.connect(audioContext.destination);

const countdownElement = document.getElementById("countdown");
var track2 = audioContext.createMediaElementSource(countdownElement);
track2.connect(audioContext.destination);

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


// Select our play button
const playButton = document.getElementById("audioButton");

playButton.addEventListener(
  "click",
  () => {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      console.log("playig");
      musicElement.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      musicElement.pause();
      playButton.dataset.playing = "false";
    }
  },
  false,
);

musicElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false,
);

addEventListener(
"StartGame",
  () => {
    musicElement.pause();
    musicElement.currentTime=0;
    musicElement.playbackRate =1/2;
    musicElement.play();
    countdownElement.pause();
    countdownElement.currentTime=0;
    countdownElement.play();
}
);
addEventListener("SpeedUp",
  (e) =>{
    musicElement.playbackRate = musicElement.playbackRate + e.detail/2;
  }
);
addEventListener("GameOver",
  () =>{
    musicElement.playbackRate = 1;
    musicElement.pause();
  }
);