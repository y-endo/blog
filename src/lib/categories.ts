export const categories = [
  "Projects",
  "AI",
  "Frontend",
  "Backend & Cloud",
  "Design",
  "Journal",
] as const;

export type Category = (typeof categories)[number];

export function isCategory(value: string): value is Category {
  return categories.some((category) => category === value);
}
