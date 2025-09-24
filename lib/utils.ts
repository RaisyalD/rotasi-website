import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SECTOR_NAME: Record<number, string> = {
  1: 'UI/UX Designer',
  2: 'Cybersecurity',
  3: 'Data Analist',
  4: 'Game Developer',
  5: 'Network Engineer',
  6: 'IT Support',
  7: 'Cloud Engineer',
  8: 'Business Analist',
  9: 'Web Developer',
  10: 'Ethical Hacker',
}