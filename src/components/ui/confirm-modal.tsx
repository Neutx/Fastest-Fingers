"use client"

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-[#F0F0F0] rounded-[55px] p-12 max-w-md w-full shadow-2xl card-hover">
        <h2 className="text-[#A578FD] font-faster-one text-3xl text-center mb-6">
          {title}
        </h2>
        
        <div className="mb-8">
          <p className="text-black font-jost text-center text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg font-degular-semibold uppercase border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors button-hover focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-[#A578FD] text-white px-6 py-3 rounded-lg font-degular-semibold uppercase hover:bg-[#A578FD]/90 transition-colors button-hover focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 