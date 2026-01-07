import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  width = 'max-w-xl' 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${
        isOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-neutralDark/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={`relative w-full ${width} bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
          <h3 className="text-xl font-heading font-bold text-neutralDark">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-neutralDark hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#F8F9FA]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};