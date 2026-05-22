/**
 * Save + undo/redo controls for page builder and site content.
 */
export default function EditorHistoryToolbar({
  saving = false,
  dirty = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onUndo,
  onRedo,
  saveLabel = "Save",
  status = "",
}) {
  return (
    <div className="ve-history-toolbar" role="toolbar" aria-label="Editor actions">
      <div className="ve-history-toolbar__history">
        <button
          type="button"
          className="ve-btn ve-btn--icon"
          title="Undo (Ctrl+Z)"
          disabled={!canUndo || saving}
          onClick={onUndo}
          aria-label="Undo"
        >
          <i className="fa-solid fa-rotate-left" aria-hidden="true" />
          Undo
        </button>
        <button
          type="button"
          className="ve-btn ve-btn--icon"
          title="Redo (Ctrl+Y)"
          disabled={!canRedo || saving}
          onClick={onRedo}
          aria-label="Redo"
        >
          <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          Redo
        </button>
      </div>
      <button
        type="button"
        className="ve-btn ve-btn--primary ve-history-toolbar__save"
        disabled={saving || (!dirty && !onSave)}
        onClick={onSave}
        title="Save (Ctrl+S)"
      >
        <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
        {saving ? "Saving…" : saveLabel}
      </button>
      {dirty && !status && (
        <span className="ve-history-toolbar__dirty" title="Unsaved changes">
          Unsaved
        </span>
      )}
      {status ? <span className="ve-status ve-history-toolbar__status">{status}</span> : null}
    </div>
  );
}
