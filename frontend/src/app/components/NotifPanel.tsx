import { useState } from "react";
import { notifications } from "../data/mockData";
import { G, RED } from "../constants";

export function NotifPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;
  const typeIcon: Record<string, string> = { achievement: "🏅", exam: "📋", rank: "🏆", course: "📚", ai: "🤖" };

  if (!open) return null;
  return (
    <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="font-bold text-sm">Notifications {unread > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-white text-xs" style={{ background: RED }}>{unread}</span>}</div>
        <button onClick={() => setItems(i => i.map(n => ({ ...n, read: true })))} className="text-xs font-semibold" style={{ color: G }}>Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.map(n => (
          <div key={n.id} onClick={() => setItems(i => i.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-green-50" : ""}`}>
            <span className="text-xl flex-shrink-0">{typeIcon[n.type]}</span>
            <div className="min-w-0">
              <p className={`text-xs leading-relaxed ${!n.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{n.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: G }} />}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border">
        <button className="text-xs font-bold w-full text-center" style={{ color: G }}>View all notifications →</button>
      </div>
    </div>
  );
}
