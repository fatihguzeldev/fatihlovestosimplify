import './fonts.css';
import { theme } from './theme';

export const fontFamily = theme.fontFamily;

export async function loadFonts(): Promise<void> {
  const fonts = [
    [fontFamily.sans, 'normal', 400],
    [fontFamily.sans, 'normal', 500],
    [fontFamily.sans, 'italic', 400],
    [fontFamily.sans, 'italic', 500],
    [fontFamily.mono, 'normal', 400],
    [fontFamily.mono, 'normal', 500],
    [fontFamily.serif, 'italic', 400],
  ] as const;

  await Promise.all(
    fonts.map(async ([family, style, weight]) => {
      const faces = await document.fonts.load(
        `${style} ${weight} 48px "${family}"`,
        'çğıöşüÇĞİÖŞÜ 0O1lI',
      );
      if (faces.length === 0) {
        throw new Error(`Font could not be loaded: ${family} ${style} ${weight}`);
      }
    }),
  );
}
