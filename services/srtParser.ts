
import type { SrtEntry } from '../types';

export const parseSrt = (srtContent: string): SrtEntry[] => {
  const entries: SrtEntry[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      try {
        const id = parseInt(lines[0], 10);
        const time = lines[1];
        const text = lines.slice(2).join('\n');

        if (!isNaN(id) && time.includes('-->')) {
          entries.push({ id, time, text });
        }
      } catch (error) {
        console.error("Skipping malformed SRT block:", block);
      }
    }
  }
  return entries;
};

export const serializeSrt = (entries: SrtEntry[]): string => {
  return entries
    .map(entry => `${entry.id}\n${entry.time}\n${entry.text}`)
    .join('\n\n');
};
