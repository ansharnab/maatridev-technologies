/**
 * Inline logo size controls in the page builder header preview.
 */
export default function LogoEditorOverlay({
  visible = false,
  emphasized = false,
  hasFullLogo = false,
  scale = 1,
  clipWidth = 280,
  onPatch,
}) {
  if (!visible) return null;

  const safeScale = Number(scale) || 1;
  const safeClip = Number(clipWidth) || 280;

  const patchScale = (next) => {
    const v = Math.min(1.8, Math.max(0.5, next));
    onPatch?.({ logoScale: Math.round(v * 100) / 100 });
  };

  const patchClip = (next) => {
    const v = Math.min(480, Math.max(100, Math.round(next)));
    onPatch?.({ logoClipWidth: v });
  };

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`ve-logo-editor${emphasized ? " ve-logo-editor--emphasized" : ""}`}
      role="group"
      aria-label="Logo size"
      onClick={stop}
      onPointerDown={stop}
    >
      <span className="ve-logo-editor__title">
        <i className="fa-solid fa-expand" aria-hidden="true" /> Logo size
      </span>
      {!hasFullLogo ? (
        <p className="ve-logo-editor__hint">Upload a logo image to resize it here or in the panel →</p>
      ) : (
        <>
          <label className="ve-logo-editor__row">
            <span>Scale {safeScale.toFixed(2)}×</span>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={safeScale}
              onChange={(e) => patchScale(Number(e.target.value))}
              onMouseUp={(e) => patchScale(Number(e.currentTarget.value))}
            />
          </label>
          <div className="ve-logo-editor__stepper">
            <button type="button" title="Smaller" onClick={() => patchScale(safeScale - 0.1)}>
              −
            </button>
            <button type="button" title="Larger" onClick={() => patchScale(safeScale + 0.1)}>
              +
            </button>
          </div>
          <label className="ve-logo-editor__row">
            <span>Max width {safeClip}px</span>
            <input
              type="range"
              min="100"
              max="480"
              step="10"
              value={safeClip}
              onChange={(e) => patchClip(Number(e.target.value))}
              onMouseUp={(e) => patchClip(Number(e.currentTarget.value))}
            />
          </label>
          <div className="ve-logo-editor__stepper">
            <button type="button" title="Narrower crop" onClick={() => patchClip(safeClip - 20)}>
              −
            </button>
            <button type="button" title="Wider" onClick={() => patchClip(safeClip + 20)}>
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
}
