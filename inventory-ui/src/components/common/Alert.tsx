import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const config = {
    success: {
      bg: "bg-success-50",
      border: "border-success-200",
      text: "text-success-800",
      icon: <CheckCircle size={20} className="text-success-600" />,
    },
    error: {
      bg: "bg-danger-50",
      border: "border-danger-200",
      text: "text-danger-800",
      icon: <XCircle size={20} className="text-danger-600" />,
    },
    warning: {
      bg: "bg-warning-50",
      border: "border-warning-200",
      text: "text-warning-800",
      icon: <AlertCircle size={20} className="text-warning-600" />,
    },
    info: {
      bg: "bg-primary-50",
      border: "border-primary-200",
      text: "text-primary-800",
      icon: <Info size={20} className="text-primary-600" />,
    },
  };

  const { bg, border, text, icon } = config[type];

  return (
    <div
      className={`${bg} ${border} ${text} border rounded-lg p-4 flex items-start gap-3`}
    >
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-70">
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
}
