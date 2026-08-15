import { ThemeOption } from '../types';

export const developerThemes: ThemeOption[] = [
  {
    id: 'apple-orange-dark',
    name: 'Apple Inspired Dark',
    description: 'Apple design language with pure black canvas, SF Pro typography, and warm orange system accent.',
    darkBg: 'bg-[#141414]',
    darkCard: 'bg-[#1c1c1e]/70 backdrop-blur-xl',
    darkText: 'text-white',
    darkAccent: '#ff9500',
    darkSecondary: '#ffb340',
    darkBorder: 'border-white/10',
    lightBg: 'bg-[#f5f5f7]',
    lightCard: 'bg-white/70 backdrop-blur-xl',
    lightText: 'text-[#1d1d1f]',
    lightAccent: '#ff9500',
    lightSecondary: '#ff7b00',
    lightBorder: 'border-black/10',
    fontFamily: 'font-sans'
  }
];
