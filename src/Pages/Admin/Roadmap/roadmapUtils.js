/*
  Shared maths and formatting for /admin/roadmap. No JSX, so the Gantt, the
  detail panel and the forms can all import it without circular imports.
*/

export const MAX_MONTHS = 36;

export const LANE_COLORS = [
  "#5bb39e", "#d98324", "#4f6bed", "#b5478f",
  "#4f8a3d", "#8a4fd8", "#c2415a", "#5c6b8a",
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/*
  Bar placement on a grid whose FIRST track is the row label and whose next
  `cols` tracks are months 1..cols.

  The +1 skips the label track. The end is e+2 because grid-column-end names
  the line AFTER the last occupied track: months 1-3 over a 12-month axis is
  "2 / 5" (tracks 2,3,4) and months 10-12 is "11 / 14" (tracks 11,12,13,
  finishing flush with the right edge).
*/
export function barSpan(startMonth, endMonth, cols) {
  const s = clamp(Math.round(num(startMonth, 1)), 1, cols);
  const e = clamp(Math.round(num(endMonth, s)), s, cols);
  return `${s + 1} / ${e + 2}`;
}

// The axis grows with the content rather than being pinned at 12, so adding an
// 18-month curriculum widens the chart instead of clipping its bar.
export function axisMonths(curricula, programs) {
  let max = 12;
  (curricula || []).forEach((c) => { max = Math.max(max, num(c.endMonth, 0)); });
  (programs || []).forEach((p) => { max = Math.max(max, num(p.endMonth, 0)); });
  return clamp(Math.round(max), 1, MAX_MONTHS);
}

export function anchorDate(settings) {
  const match = /^(\d{4})-(\d{2})$/.exec(String((settings && settings.anchor) || ""));
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, 1);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function monthLabel(index, settings) {
  const base = anchorDate(settings);
  const d = new Date(base.getFullYear(), base.getMonth() + index, 1);
  return `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

export function anchorInputValue(settings) {
  if (settings && /^\d{4}-\d{2}$/.test(String(settings.anchor || ""))) return settings.anchor;
  const d = anchorDate(settings);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const programsOf = (programs, slug) =>
  (programs || [])
    .filter((p) => p.curriculumSlug === slug)
    .sort((a, b) => num(a.startMonth, 1) - num(b.startMonth, 1) || num(a.order, 0) - num(b.order, 0));

export const alternativesOf = (alternatives, slug) =>
  (alternatives || [])
    .filter((a) => a.curriculumSlug === slug)
    // Free first: it is the tracked path, the paid one is the comparison.
    .sort((a, b) => (a.kind === b.kind ? num(a.order, 0) - num(b.order, 0) : a.kind === "free" ? -1 : 1));

/*
  Curriculum progress is DERIVED from its programs and never stored, so a lane
  total cannot drift away from the modules it rolls up. null means "no
  programs yet", which the UI renders differently from 0%.
*/
export function curriculumProgress(programs, slug) {
  const list = programsOf(programs, slug);
  if (!list.length) return null;
  const total = list.reduce((sum, p) => sum + clamp(num(p.progress, 0), 0, 100), 0);
  return Math.round(total / list.length);
}

// Status is derived from progress for the same reason.
export function statusOf(pct) {
  if (pct >= 100) return "Done";
  if (pct > 0) return "In progress";
  return "Not started";
}

export function sortCurricula(curricula, mode) {
  const list = (curricula || []).slice();
  if (mode === "name") {
    list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  } else if (mode === "order") {
    list.sort((a, b) => num(a.order, 0) - num(b.order, 0) || String(a.name || "").localeCompare(String(b.name || "")));
  } else {
    // Default: highest rating first. Rating the tracks is pointless if the
    // page doesn't then lead with what matters most.
    list.sort(
      (a, b) =>
        num(b.rating, 0) - num(a.rating, 0) ||
        num(a.order, 0) - num(b.order, 0) ||
        String(a.name || "").localeCompare(String(b.name || ""))
    );
  }
  return list;
}

export function formatCost(alt) {
  if (!alt) return "";
  if (alt.kind === "free") return "Free";
  if (alt.costAmount === null || alt.costAmount === undefined || alt.costAmount === "") return "";
  return `$${Number(alt.costAmount).toLocaleString("en-US")}`;
}

export const listToText = (list) => (Array.isArray(list) ? list.join(", ") : "");

export const textToList = (text) =>
  String(text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
