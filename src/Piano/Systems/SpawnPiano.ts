import Update from "../../2B2D/Update";
import Position from "../../2B2D/Components/Position";
import Sprite from "../../2B2D/Components/Sprite";
import Depth from "../../2B2D/Components/Depth";
import PianoAssets from "../PianoAssets";
import PianoKey from "../Components/PianoKey";
import { Handle } from "../../2B2D/Handle";

export default function SpawnPiano(update: Update) {
  // Define piano keys
  const keys = [
    { note: 'C4', freq: 261.63, key: 'a', type: 'white' },
    { note: 'C#4', freq: 277.18, key: 'w', type: 'black' },
    { note: 'D4', freq: 293.66, key: 's', type: 'white' },
    { note: 'D#4', freq: 311.13, key: 'e', type: 'black' },
    { note: 'E4', freq: 329.63, key: 'd', type: 'white' },
    { note: 'F4', freq: 349.23, key: 'f', type: 'white' },
    { note: 'F#4', freq: 369.99, key: 't', type: 'black' },
    { note: 'G4', freq: 392.00, key: 'g', type: 'white' },
    { note: 'G#4', freq: 415.30, key: 'y', type: 'black' },
    { note: 'A4', freq: 440.00, key: 'h', type: 'white' },
    { note: 'A#4', freq: 466.16, key: 'u', type: 'black' },
    { note: 'B4', freq: 493.88, key: 'j', type: 'white' },
    { note: 'C5', freq: 523.25, key: 'k', type: 'white' },
  ];

  const startX = 200;
  const startY = 300;
  // sprites are 18x18
  const whiteKeyWidth = 20;
  // const blackKeyWidth = 14;

  let whiteKeyIndex = 0;

  keys.forEach((k) => {
    const isWhite = k.type === 'white';
    let x = startX;
    let y = startY;
    let depth = 0.5;
    let frame = '0'; // use frame 0 for white

    if (isWhite) {
      x += whiteKeyIndex * whiteKeyWidth;
      whiteKeyIndex++;
    } else {
       // Position black keys relative to white keys
       x += (whiteKeyIndex - 1) * whiteKeyWidth + (whiteKeyWidth / 2);
       y -= 10;
       depth = 0.6; // On top
       frame = '1'; // use frame 1 for black
    }

    update.spawn(
      Position.from(x, y),
      new Depth(depth),
      new Sprite(PianoAssets.hud.handle, frame),
      new PianoKey(k.note, k.freq, k.key)
    );
  });
}
