import Camera from "../../../2B2D/Components/Camera";
import Position from "../../../2B2D/Components/Position";
import Vec2 from "../../../2B2D/Math/Vec2";
import SpriteRenderer from "../../../2B2D/Rendering/Sprite/SpriteRenderer";
import Update from "../../../2B2D/Update";
import { GradientRenderer } from "../../../2B2D/Rendering/Gradient/GradientRenderer";
import Gradient from "../../../2B2D/Components/Gradient";
import Color from "../../../2B2D/Math/Color";
import Depth from "../../../2B2D/Components/Depth";

export default function SetupRendering(update: Update) {
  update.renderers.add(SpriteRenderer.create);
  update.renderers.add(GradientRenderer.create);

  // Set camera to match Example
  update.spawn(
    new Camera(Vec2.from(8 / 800, 8 / 600)),
    Position.from(0, 0) // Example uses 0,0 but puts camera in a parent.
  );

  // Example uses:
  // Parent -> Shaker -> Camera
  // Camera is at local 0,0.
  // Parent is at 0,0.
  // Shaker is at 0,0.

  // Wait, if camera is at 0,0, and I spawn keys at 200, 300.
  // NDC: -1 to 1.
  // If zoom is 8/800 = 0.01.
  // x=200 * 0.01 = 2.
  // 2 is outside [-1, 1].

  // So the Example coordinate system might be centered at 0,0?
  // Let's check SpawnLevel.ts

  // SpawnLevel uses 0,0 for bg.
  // LDTK levels usually start at 0,0 and go positive.

  // If the camera is at 0,0 and has zoom 0.01.
  // View is -100 to +100? No.

  // Let's check Camera implementation again.
  // Actually, I'll just use the values that make sense.
  // If I want 0 to 800 to be visible.
  // Center should be at 400, 300.
  // Extent is 400.
  // 400 * zoom = 1. => zoom = 1/400.

  // 1/400 = 0.0025.
  // Example uses 8/800 = 0.01.
  // 0.01 * 400 = 4.
  // So Example view is very small? Or maybe 8 is not pixels but tiles?

  // Let's try zoom = 2/800.

  // Or better, let's look at `SetupRendering.ts` in Example again.
  // `update.spawn(new Parent(shaker), new Camera(Vec2.from(8 / 800, 8 / 600)), Position.from(0, 0));`
  // `shaker` has parent `parent`.
  // `parent` has `Position.from(0, 0)`.

  // Wait, if camera is at 0,0.
  // And it views a level.
  // The level must be near 0,0.

  // Let's set camera position to 400, 300 and see.

  // I will update the camera to be at 400, 300 with zoom 2/600 (height) so that 600 pixels fit in -1 to 1 (height 2).
  // 300 * zoom = 1 => zoom = 1/300.
  // 1/300 is approx 0.0033.

  update.spawn(
    new Camera(Vec2.from(2/800, 2/600)),
    Position.from(400, 300)
  );

  // Add background gradient
  update.spawn(
    Position.from(400, 300),
    new Depth(0),
    Gradient.SolidBox(Color.Blue(1), Vec2.from(800, 600))
  );
}
