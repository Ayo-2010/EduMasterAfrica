export function ProgressBar({ value, color = "#0c6438", height = "h-2" }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`${height} bg-muted rounded-full overflow-hidden`}>
      <div className={`${height} rounded-full transition-all duration-700`} style={{ width: `${value}%`, background: color }} />
    </div>
  );
}
