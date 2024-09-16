const langSelectEl = document.getElementById("lang-select");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "pl-PL";
recognition.interimResults = false;

langSelectEl.addEventListener("change", (e) => {
  recognition.lang = e.target.value;
});

export default recognition;
