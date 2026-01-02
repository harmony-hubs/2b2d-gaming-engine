import Builder from "../2B2D/Builder";
import GameLoopState from "./States/GameLoopState";
import SpawnPiano from "./Systems/SpawnPiano";
import HandlePianoInput from "./Systems/HandlePianoInput";
import PianoResource from "./Resources/PianoResource";
import InitPlugin from "./Init/InitPlugin";

export default function PianoPlugin(builder: Builder) {
  builder.plugin(InitPlugin);
  builder.resource(new PianoResource());
  builder.schedule.enter(GameLoopState, SpawnPiano);
  builder.schedule.update(GameLoopState, HandlePianoInput);
}
