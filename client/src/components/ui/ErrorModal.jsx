import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";

export function ErrorModal({ open, onClose, title = "Помилка", message }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Зрозуміло
        </Button>
      }
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <p className="text-slate-200 pt-1.5">{message}</p>
      </div>
    </Modal>
  );
}
