import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge de classes com desempate do Tailwind. Utilities da casa não começam com `text-`. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
