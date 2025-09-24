
export interface SrtEntry {
  id: number;
  time: string;
  text: string;
}

export type SrtData = SrtEntry[] | null;

export enum Gender {
  Male = 'Nam',
  Female = 'Nữ',
  Unknown = 'Không xác định',
}

export interface Character {
  name: string;
  gender: Gender;
}

export type Tab = 'original' | 'normalized' | 'translated' | 'fixed' | 'log';
