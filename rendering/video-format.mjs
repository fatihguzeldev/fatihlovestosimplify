export function renderFormat({ width, height, fps, resolutionScale = 1 }) {
  if (
    ![width, height].every(
      (value) => Number.isSafeInteger(value) && value > 0 && value % 2 === 0,
    ) ||
    fps !== 60 ||
    resolutionScale !== 1
  ) {
    throw new Error(
      'Custom export requires positive even dimensions at native resolution and 60 FPS.',
    );
  }
  return { width, height, fps };
}

export function videoMatches(stream, format, frames) {
  return (
    stream?.width === format.width &&
    stream?.height === format.height &&
    stream?.r_frame_rate === `${format.fps}/1` &&
    Number(stream?.nb_read_frames) === frames
  );
}
