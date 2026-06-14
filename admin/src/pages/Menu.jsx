import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { getMenu, updateMenuItem, addMenuItem, saveMenu } from "@shared/data.js";
import { CATEGORIES } from "@shared/constants.js";
import { useLive } from "../lib/useLive.js";
import { inr } from "../lib/format.js";

function stockStyle(stock) {
  if (stock <= 0) return { color: "var(--text-muted)", textDecoration: "line-through" };
  if (stock <= 2) return { color: "var(--danger)" };
  if (stock <= 10) return { color: "var(--amber)" };
  return { color: "var(--success)" };
}

const EMPTY = { name: "", category: "Snacks", price: "", stock: "", description: "" };

export default function Menu() {
  const menu = useLive(() => getMenu());
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const remove = (id) => saveMenu(getMenu().filter((m) => m.id !== id));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") return;
    addMenuItem({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description.trim(),
    });
    setForm(EMPTY);
    setSheet(false);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary">Menu &amp; inventory</h1>
        <button onClick={() => setSheet(true)} className="btn-gold flex items-center gap-2 px-3 py-2 text-sm">
          <Plus size={15} /> Add item
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal">Active</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {menu.map((m) => (
              <tr key={m.id} className="border-t border-hairline">
                <td className="px-4 py-2">
                  <input
                    key={m.id + "n" + m.name}
                    defaultValue={m.name}
                    onBlur={(e) => e.target.value.trim() && updateMenuItem(m.id, { name: e.target.value.trim() })}
                    className="field w-44 px-2 py-1.5"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={m.category}
                    onChange={(e) => updateMenuItem(m.id, { category: e.target.value })}
                    className="field px-2 py-1.5"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    key={m.id + "p" + m.price}
                    defaultValue={m.price}
                    onBlur={(e) => updateMenuItem(m.id, { price: Number(e.target.value) })}
                    className="field w-24 px-2 py-1.5"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    key={m.id + "s" + m.stock}
                    defaultValue={m.stock}
                    onBlur={(e) => updateMenuItem(m.id, { stock: Math.max(0, Number(e.target.value)) })}
                    style={stockStyle(m.stock)}
                    className="field w-20 px-2 py-1.5 font-medium"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => updateMenuItem(m.id, { active: !m.active })}
                    className="relative h-6 w-11 rounded-full border border-hairline transition-colors"
                    style={{ background: m.active ? "var(--gold)" : "var(--bg-elevated)" }}
                    aria-label="Toggle active"
                  >
                    <span
                      className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
                      style={{ left: m.active ? "22px" : "4px", background: m.active ? "var(--bg-base)" : "var(--text-muted)" }}
                    />
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => remove(m.id)}
                    className="text-muted transition-colors hover:text-danger"
                    aria-label="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add item sheet */}
      {sheet && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={() => setSheet(false)}>
          <div className="absolute inset-0 bg-base/60" />
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="sheet-rise relative w-full max-w-lg rounded-t-2xl border border-hairline bg-surface p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg text-primary">Add menu item</h2>
              <button type="button" onClick={() => setSheet(false)} className="btn-ghost grid h-8 w-8 place-items-center p-0">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field col-span-2 px-3 py-2 text-sm"
                required
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="field px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="field px-3 py-2 text-sm"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="field col-span-2 px-3 py-2 text-sm"
              />
              <input
                placeholder="Short description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="field col-span-2 px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="btn-gold mt-4 w-full py-2.5">
              Add item
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
