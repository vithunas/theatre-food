/** Format a number as Indian Rupees, e.g. 1240 -> "₹1,240". */
export function inr(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}
