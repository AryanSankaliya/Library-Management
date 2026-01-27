import { createContext, useContext, useState, useCallback } from "react";
import ConfirmationModal from "../components/UI/ConfirmationModal";

const ConfirmationContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmationProvider");
    }
    return context;
};

export const ConfirmationProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        type: "danger",
        resolve: null
    });

    const confirm = useCallback((message, title = "Are you sure?", options = {}) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                message,
                title,
                confirmText: options.confirmText || "Confirm",
                cancelText: options.cancelText || "Cancel",
                type: options.type || "danger",
                resolve
            });
        });
    }, []);

    const handleConfirm = () => {
        if (modalState.resolve) modalState.resolve(true);
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const handleCancel = () => {
        if (modalState.resolve) modalState.resolve(false);
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ConfirmationContext.Provider value={confirm}>
            {children}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                type={modalState.type}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmationContext.Provider>
    );
};

export default ConfirmationContext;
