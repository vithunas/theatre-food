import { STATUS_FLOW, STATUS_LABELS } from "@shared/constants.js";
import { updateOrderStatus } from "@shared/data.js";

export function statusColor(status) {
  if (status === "delivered") return "var(--success)";
  if (status === "placed") return "var(--text-muted)";
  if (status === "preparing") return "var(--amber)";
  return "var(--gold)";
}

export function StatusBadge({ status }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs"
      style={{ color: statusColor(status), borderColor: "var(--border)" }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function StatusSelect({ order }) {
  return (
    <select
      value={order.status}
      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
      className="field px-2 py-1.5 text-xs"
    >
      {STATUS_FLOW.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
