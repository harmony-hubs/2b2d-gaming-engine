import AssetsResource from "../2B2D/Resources/AssetsResource";
import TextureAsset from "../2B2D/Assets/TextureAsset";
import { Handle } from "../2B2D/Handle";

// We'll reuse the hud.png for keys. Frame 0 can be white key, Frame 1 can be black key?
// Actually hud.json has 3 frames 18x18.
// We can use them as keys.

const PianoAssets = {
  hud: { handle: 'hud' as Handle, path: 'assets/hud.png', jsonPath: 'assets/hud.json' },

  load: (assets: AssetsResource) => {
    assets.add(TextureAsset.loadSpriteWithAtlas(PianoAssets.hud.handle, PianoAssets.hud.path, PianoAssets.hud.jsonPath));
  },

  isLoaded: (assets: AssetsResource) => {
    return assets.loaded([PianoAssets.hud.handle]);
  }
};

export default PianoAssets;
