import { useMemo, useState } from "react";
import { X, Download } from "lucide-react";
import { getOrders } from "@shared/data.js";
import { STATUS_FLOW, STATUS_LABELS } from "@shared/constants.js";
import { useLive } from "../lib/useLive.js";
import { inr } from "../lib/format.js";
import { StatusBadge, StatusSelect } from "../components/Status.jsx";

function toCSV(orders) {
  const head = ["Order ID", "Seat", "Status", "Total", "Placed", "Items"];
  const rows = orders.map((o) => [
    o.id,
    o.seatNumber,
    o.status,
    o.totalAmount,
    new Date(o.placedAt).toLocaleString("en-IN"),
    o.items.map((i) => `${i.qty}x ${i.name}`).join(" | "),
  ]);
  return [head, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export default function Orders() {
  const orders = useLive(() => getOrders(), { pollMs: 5000 });
  const [status, setStatus] = useState("All");
  const [seat, setSeat] = useState("");
  const [date, setDate] = useState("");
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    return [...orders]
      .sort((a, b) => b.placedAt - a.placedAt)
      .filter((o) => status === "All" || o.status === status)
      .filter((o) => !seat || (o.seatNumber || "").toLowerCase().includes(seat.toLowerCase()))
      .filter((o) => !date || new Date(o.placedAt).toISOString().slice(0, 10) === date);
  }, [orders, status, seat, date]);

  const selected = orders.find((o) => o.id === openId);

  const exportCSV = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Orders</h1>
        <button onClick={exportCSV} className="btn-ghost flex items-center gap-2 px-3 py-2 text-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field px-3 py-2 text-sm">
          <option value="All">All statuses</option>
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          placeholder="Filter by seat"
          className="field px-3 py-2 text-sm"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field px-3 py-2 text-sm" />
        {(status !== "All" || seat || date) && (
          <button
            onClick={() => {
              setStatus("All");
              setSeat("");
              setDate("");
            }}
            className="text-sm text-muted transition-colors hover:text-gold"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">No orders match these filters.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-normal">Order</th>
                <th className="px-5 py-3 font-normal">Seat</th>
                <th className="px-5 py-3 font-normal">Items</th>
                <th className="px-5 py-3 font-normal">Total</th>
                <th className="px-5 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setOpenId(o.id)}
                  className="cursor-pointer border-t border-hairline transition-colors hover:bg-elevated"
                >
                  <td className="px-5 py-3 text-primary">{o.id}</td>
                  <td className="px-5 py-3 text-muted">{o.seatNumber}</td>
                  <td className="px-5 py-3 text-muted">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-5 py-3 text-muted">{inr(o.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-in detail */}
      {selected && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenId(null)}>
          <div className="absolute inset-0 bg-base/60" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="panel-slide absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-hairline bg-surface p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-xl text-primary">{selected.id}</h2>
                <p className="text-sm text-muted">Seat {selected.seatNumber}</p>
              </div>
              <button onClick={() => setOpenId(null)} className="btn-ghost grid h-8 w-8 place-items-center p-0">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <StatusBadge status={selected.status} />
              <StatusSelect order={selected} />
            </div>

            <p className="mt-6 mb-2 text-xs uppercase tracking-wide text-muted">Items</p>
            <ul className="space-y-2">
              {selected.items.map((i) => (
                <li key={i.id} className="flex justify-between rounded-lg border border-hairline bg-base/40 px-3 py-2 text-sm">
                  <span className="text-primary">
                    {i.qty} × {i.name}
                  </span>
                  <span className="text-muted">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            {selected.specialInstructions && (
              <p className="mt-4 rounded-lg border border-hairline bg-base/40 px-3 py-2 text-sm text-muted">
                Note: {selected.specialInstructions}
              </p>
            )}

            <div className="mt-5 flex justify-between border-t border-hairline pt-4 text-primary">
              <span>Total</span>
              <span className="font-medium">{inr(selected.totalAmount)}</span>
            </div>

            <p className="mt-4 text-xs text-muted">
              Placed {new Date(selected.placedAt).toLocaleString("en-IN")}
            </p>
            {selected.feedback && (
              <p className="mt-2 text-xs text-success">
                Rated {selected.feedback.rating}/5
                {selected.feedback.comment ? ` — “${selected.feedback.comment}”` : ""}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
