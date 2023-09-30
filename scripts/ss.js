const overlay = useRef(null);
const wrapper = useRef(null);

const onDismiss = () => {};

const onClick = useCallback(
  (e) => {
    if (e.target === overlay.current) {
      if (onDismiss) onDismiss();
    }
  },
  [onDismiss, overlay, wrapper]
);
const showModal = (children) => {
  return `
  <div className="modal-overlay" onClick={onClick}>
  <div className="modal-wrapper">
  ${children}
  </div>
  </div>
  `;
};
