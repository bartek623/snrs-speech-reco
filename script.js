import search from "./modules/search.js";
import recognition from "./modules/speechRecognition.js";

const speechResultsAreaEl = document.querySelector(".speech-results-area");
const speechCtrlBtn = document.querySelector(".speech-ctrl-btn");

speechCtrlBtn.addEventListener("click", () => {
  if (speechCtrlBtn.textContent === "start") {
    recognition.start();
    speechCtrlBtn.textContent = "stop";
  } else {
    recognition.stop();
    speechCtrlBtn.textContent = "start";
  }
});

recognition.addEventListener("result", async (e) => {
  const results = e.results[0][0].transcript;

  speechCtrlBtn.textContent = "start";
  speechResultsAreaEl.value = results;
  search(results);
});
