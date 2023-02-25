import beep from "../assets/sounds/beep.wav";
import fast from "../assets/sounds/fast.wav";
import slow from "../assets/sounds/slow.wav";

const sounds = new Map<string, string>([
  ["beep", beep],
  ["fast", fast],
  ["slow", slow],
]);
export default sounds;
