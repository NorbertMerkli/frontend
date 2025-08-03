import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export type PropsWithClassName = { className?: string };

export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
