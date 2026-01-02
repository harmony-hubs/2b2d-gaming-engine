import Builder from "./2B2D/Builder";
import PianoPlugin from "./Piano/PianoPlugin";

async function main() {
  const builder = await Builder.create(800, 600);

  builder.plugin(PianoPlugin);

  const engine = await builder.finish();

  engine.start();
};


main().catch(console.error);
