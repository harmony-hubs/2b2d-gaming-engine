import Update from "../../../2B2D/Update";
import PianoAssets from "../../PianoAssets";
import InitState from "../States/InitState";
import GameLoopState from "../../States/GameLoopState";

export default function AwaitLoaded(update: Update) {
  const loaded = PianoAssets.isLoaded(update.assets());
  if (loaded) {
    update.schedule.exit(InitState);
    update.schedule.enter(GameLoopState);
  }
}
