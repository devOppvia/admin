import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '1000px',
    showCloseButton = true,
    className = ''
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={`relative w-full bg-white rounded-[48px] shadow-glass overflow-hidden flex flex-col border border-white/20 animate-slideUp ${className}`}
                style={{ maxWidth, maxHeight: '90vh' }}
            >
                {/* Header Section */}
                {title && (
                    <div className="p-8 lg:p-10 border-b border-brand-primary/5 bg-linear-to-br from-brand-primary/3 to-transparent flex items-center justify-between">
                        <h2 className="text-2xl font-black text-brand-primary tracking-tighter uppercase">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-3 bg-white text-brand-primary/20 hover:text-brand-primary hover:scale-110 rounded-2xl shadow-soft transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Dynamic Close Button (if title is absent) */}
                {!title && showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 z-10 p-3 bg-white text-brand-primary/20 hover:text-brand-primary hover:scale-110 rounded-2xl shadow-soft transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;
