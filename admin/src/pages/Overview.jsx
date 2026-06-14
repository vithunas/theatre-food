import { useMemo } from "react";
import { ShoppingBag, IndianRupee, Activity, Timer } from "lucide-react";
import { getOrders } from "@shared/data.js";
import { STATUS_FLOW, STATUS_LABELS } from "@shared/constants.js";
import { useLive } from "../lib/useLive.js";
import { inr } from "../lib/format.js";
import { StatusBadge, StatusSelect, statusColor } from "../components/Status.jsx";

function isToday(ts) {
  const d = new Date(ts);
  const n = new Date();
  return d.toDateString() === n.toDateString();
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-gold">
        <Icon size={17} />
      </div>
      <p className="text-2xl text-primary">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default function Overview() {
  const orders = useLive(() => getOrders(), { pollMs: 5000 });

  const stats = useMemo(() => {
    const today = orders.filter((o) => isToday(o.placedAt));
    const revenue = today.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const active = orders.filter((o) => o.status !== "delivered").length;
    const delivered = orders.filter((o) => o.status === "delivered" && o.updatedAt && o.placedAt);
    const avgMs = delivered.length
      ? delivered.reduce((s, o) => s + (o.updatedAt - o.placedAt), 0) / delivered.length
      : 0;
    const byStatus = STATUS_FLOW.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));
    const max = Math.max(1, ...byStatus.map((b) => b.count));
    return {
      ordersToday: today.length,
      revenue,
      active,
      avgMin: avgMs ? Math.round(avgMs / 60000) : null,
      byStatus,
      max,
    };
  }, [orders]);

  const recent = [...orders].sort((a, b) => b.placedAt - a.placedAt).slice(0, 10);

  return (
    <div>
      <h1 className="mb-5 font-heading text-2xl text-primary">Live overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={ShoppingBag} label="Orders today" value={stats.ordersToday} />
        <MetricCard icon={IndianRupee} label="Revenue today" value={inr(stats.revenue)} />
        <MetricCard icon={Activity} label="Active orders" value={stats.active} />
        <MetricCard icon={Timer} label="Avg delivery time" value={stats.avgMin ? `${stats.avgMin} min` : "—"} />
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
        <h2 className="mb-4 text-base text-primary">Orders by status</h2>
        <div className="space-y-3">
          {stats.byStatus.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-muted">{STATUS_LABELS[status]}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(count / stats.max) * 100}%`, background: statusColor(status) }}
                />
              </div>
              <span className="w-8 text-right text-sm text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface">
        <h2 className="border-b border-hairline px-5 py-4 text-base text-primary">Recent orders</h2>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-normal">Order</th>
                <th className="px-5 py-3 font-normal">Seat</th>
                <th className="px-5 py-3 font-normal">Total</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal">Update</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-hairline">
                  <td className="px-5 py-3 text-primary">{o.id}</td>
                  <td className="px-5 py-3 text-muted">{o.seatNumber}</td>
                  <td className="px-5 py-3 text-muted">{inr(o.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusSelect order={o} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
