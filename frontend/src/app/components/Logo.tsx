import { G, AMBER } from "../constants";

export function Logo({ onClick, size = "md" }: { onClick?: () => void; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "text-base" : "text-lg";
  return (
    <button onClick={onClick} className={`flex items-center gap-2 font-black ${cls}`} style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: G }}>E</div>
      <span style={{ color: G }}>EduMaster</span>
      <span style={{ color: AMBER }}>Africa</span>
    </button>
  );
}
