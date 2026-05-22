/** @returns {boolean} */
export function canUndoHistory(past) {
  return Array.isArray(past) && past.length > 0;
}

/** @returns {boolean} */
export function canRedoHistory(future) {
  return Array.isArray(future) && future.length > 0;
}

/**
 * Push current snapshot onto past stack; clear redo branch.
 * @param {{ past: string[], future: string[] }} stacks
 * @param {() => object} getSnapshot
 */
export function pushEditorHistory(stacks, getSnapshot) {
  const snap = JSON.stringify(getSnapshot());
  const last = stacks.past[stacks.past.length - 1];
  if (last === snap) return;
  stacks.past.push(snap);
  if (stacks.past.length > 50) stacks.past.shift();
  stacks.future.length = 0;
}

/**
 * @returns {object | null} snapshot to apply, or null if nothing to undo
 */
export function popUndo(stacks, getSnapshot) {
  if (!canUndoHistory(stacks.past)) return null;
  const prev = stacks.past.pop();
  stacks.future.push(JSON.stringify(getSnapshot()));
  return JSON.parse(prev);
}

/**
 * @returns {object | null}
 */
export function popRedo(stacks, getSnapshot) {
  if (!canRedoHistory(stacks.future)) return null;
  const next = stacks.future.pop();
  stacks.past.push(JSON.stringify(getSnapshot()));
  return JSON.parse(next);
}
