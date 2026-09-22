import './fonts.css';
import {theme} from './theme';

export const fontFamily = theme.fontFamily;

// Yield this before creating text so the first frame uses the intended metrics.
export async function loadFonts(): Promise<void> {
  await Promise.all(
    Object.values(fontFamily).flatMap(family =>
      [400, 500].map(async weight => {
        const faces = await document.fonts.load(
          `${weight} 48px "${family}"`,
          'çğıöşüÇĞİÖŞÜ 0O1lI',
        );
        if (faces.length === 0) {
          throw new Error(`Font could not be loaded: ${family} ${weight}`);
        }
      }),
    ),
  );
}
