import React, {createContext, ReactNode, useContext} from 'react';
import {toast} from "react-toastify";
import './Toaster.css';
import 'react-toastify/dist/ReactToastify.css';
import {CopyOutlined} from "@ant-design/icons";
import {toastTypes} from "../../models/Toast";


interface ToasterContextProps {
    showToast: (title: string, message: string, type: toastTypes) => void;
}

const ToasterContext = createContext<ToasterContextProps | undefined>(undefined);

export interface IToasterProviderProps {
    children: ReactNode;
}

export const ToasterProvider = ({children}: IToasterProviderProps) => {

    const toastOptions = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 6000,
        closeButton: false,
        className: 'toast-wrapper'
    };
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Some error with clipboard', err);
        }
    };
    const showToast = (title: string, message: string, type: toastTypes) => {
        switch (type) {
            case toastTypes.success:
                toast.success(<div className={'custom-toast toast-success'}>
                        <div className="toast-header">
                            <strong className="mr-auto">{title}</strong>
                        </div>
                        <div className="toast-body">{message}</div>
                    <div className={'custom-toast--clipboard'}>
                        <CopyOutlined />
                    </div>
                </div>, {
                    ...toastOptions,
                    onClose: () => {
                        copyToClipboard(`${title}.${message}`);
                    },
                });
                break;
            case toastTypes.error:
                toast.error(<div className={'custom-toast toast-error'}>
                        <div className="toast-header">
                            <strong className="mr-auto">{title}</strong>
                        </div>
                        <div className="toast-body">{message}</div>
                    <div className={'custom-toast--clipboard'}>
                        <CopyOutlined />
                    </div>
                    </div>, {
                    ...toastOptions,
                    onClose: () => {
                        copyToClipboard(`${title}.${message}`);
                    },
                });
                break;
            case toastTypes.info:
                toast.info(<div className={'custom-toast toast-info'}>
                        <div className="toast-header">
                            <strong className="mr-auto">{title}</strong>
                        </div>
                        <div className="toast-body">{message}</div>
                    <div className={'custom-toast--clipboard'}>
                        <CopyOutlined />
                    </div>
                    </div>, {
                    ...toastOptions,
                    onClose: () => {
                        copyToClipboard(`${title}.${message}`);
                    },
                });
                break;
            case toastTypes.warning:
                toast.warning(<div className={'custom-toast toast-warning'}>
                        <div className="toast-header">
                            <strong className="mr-auto">{title}</strong>
                        </div>
                        <div className="toast-body">{message}</div>
                    <div className={'custom-toast--clipboard'}>
                    <CopyOutlined />
                </div>
                    </div>, {
                    ...toastOptions,
                    onClose: () => {
                        copyToClipboard(`${title}.${message}`);
                    },
                });
                break;
            default:
                return '';
        }
    };

    return (
        <ToasterContext.Provider value={{showToast}}>
            {children}
        </ToasterContext.Provider>
    );
};

export const useToaster = (): ToasterContextProps => {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error('useToaster must be used within a ToasterProvider');
    }
    return context;
};
