import { useState } from "react";
import { Check } from "lucide-react";
import { getSettings, saveSettings } from "@shared/data.js";
import { useLive } from "../lib/useLive.js";

export default function SettingsPage() {
  const settings = useLive(() => getSettings());
  const [name, setName] = useState(settings.theatreName);
  const [saved, setSaved] = useState(false);

  const saveName = () => {
    saveSettings({ theatreName: name.trim() || "Starlight Cinema" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-xl">
      <h1 className="mb-5 font-heading text-2xl text-primary">Settings</h1>

      <div className="rounded-2xl border border-hairline bg-surface p-5">
        <label className="mb-2 block text-sm text-muted">Theatre name</label>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="field flex-1 px-3 py-2.5" />
          <button onClick={saveName} className="btn-gold flex items-center gap-2 px-4">
            {saved ? <Check size={16} /> : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-hairline bg-surface p-5">
        <div>
          <p className="text-primary">Ordering enabled</p>
          <p className="text-sm text-muted">When off, customers see a paused message at check-in.</p>
        </div>
        <button
          onClick={() => saveSettings({ orderingEnabled: !settings.orderingEnabled })}
          className="relative h-7 w-12 shrink-0 rounded-full border border-hairline transition-colors"
          style={{ background: settings.orderingEnabled ? "var(--success)" : "var(--bg-elevated)" }}
          aria-label="Toggle ordering"
        >
          <span
            className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
            style={{
              left: settings.orderingEnabled ? "24px" : "4px",
              background: settings.orderingEnabled ? "var(--bg-base)" : "var(--text-muted)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
