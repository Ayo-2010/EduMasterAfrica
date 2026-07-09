export function BadgeComp({ label, color = "#0c6438" }: { label: string; color?: string }) {
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{label}</span>;
}
