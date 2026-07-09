import { G } from "../constants";

export function initialsOf(name?: string): string {
  if (!name) return "ME";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ME";
}

export function AvatarComp({ initials, size = "md", color = G }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}
