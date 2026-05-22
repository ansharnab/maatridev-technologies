/**
 * Shared Save / Undo / Redo bar for admin editor panels.
 */
export default function EditorActionBar({
  dirty = false,
  saving = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onUndo,
  onRedo,
  saveLabel = "Save",
  status = "",
}) {
  return (
    <div className={`ve-action-bar${dirty ? " ve-action-bar--dirty" : ""}`}>
      <div className="ve-action-bar__primary">
        <button
          type="button"
          className="ve-btn ve-btn--icon"
          title="Undo (Ctrl+Z)"
          disabled={!canUndo || saving}
          onClick={onUndo}
        >
          <i className="fa-solid fa-rotate-left" aria-hidden="true" />
          <span>Undo</span>
        </button>
        <button
          type="button"
          className="ve-btn ve-btn--icon"
          title="Redo (Ctrl+Y)"
          disabled={!canRedo || saving}
          onClick={onRedo}
        >
          <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          <span>Redo</span>
        </button>
        <button
          type="button"
          className="ve-btn ve-btn--primary ve-action-bar__save"
          disabled={saving}
          onClick={onSave}
        >
          <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
      {(dirty || status) && (
        <span className={`ve-action-bar__status${dirty ? " ve-status--dirty" : ""}`}>
          {dirty ? "Unsaved changes" : status}
        </span>
      )}
    </div>
  );
}
