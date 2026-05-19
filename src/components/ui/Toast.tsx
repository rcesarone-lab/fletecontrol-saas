type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}