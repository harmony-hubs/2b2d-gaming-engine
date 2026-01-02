import Update from "../../../2B2D/Update";
import PianoAssets from "../../PianoAssets";

export default function LoadAssets(update: Update) {
  const assets = update.assets();
  PianoAssets.load(assets);
}
