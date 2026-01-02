import Update from "../../2B2D/Update";
import PianoKey from "../Components/PianoKey";
import PianoResource from "../Resources/PianoResource";
import Sprite from "../../2B2D/Components/Sprite";

export default function HandlePianoInput(update: Update) {
  const keys = update.keys();
  const piano = update.resource(PianoResource);

  const query = update.ecs.query(PianoKey, Sprite);

  for (const { entity, components } of query) {
    const pk = components.PianoKey;
    const sprite = components.Sprite;

    if (keys.isKeyDown(pk.key)) {
      if (!pk.isPressed) {
        pk.isPressed = true;
        piano.playTone(pk.frequency);

        // Visual feedback
        // Change frame to '2' (pressed state)
        sprite.frame = '2';
      }
    } else {
      if (pk.isPressed) {
        pk.isPressed = false;
        // Revert visual
        if (pk.note.includes('#')) {
          sprite.frame = '1';
        } else {
          sprite.frame = '0';
        }
      }
    }
  }
}
