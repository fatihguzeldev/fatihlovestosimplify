import './fonts.css';
import {theme} from './theme';

export const fontFamily = theme.fontFamily;

export async function loadFonts(): Promise<void> {
  const fonts = [
    [fontFamily.sans, 'normal'],
    [fontFamily.sans, 'italic'],
    [fontFamily.mono, 'normal'],
  ] as const;

  await Promise.all(
    fonts.flatMap(([family, style]) =>
      [400, 500].map(async weight => {
        const faces = await document.fonts.load(
          `${style} ${weight} 48px "${family}"`,
          'çğıöşüÇĞİÖŞÜ 0O1lI',
        );
        if (faces.length === 0) {
          throw new Error(`Font could not be loaded: ${family} ${style} ${weight}`);
        }
      }),
    ),
  );
}
