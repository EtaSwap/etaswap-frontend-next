import {Modal} from "antd";
import React from "react";
import {IWallets, IWalletsInfo} from "../../../models";

export interface IConnectWalletModalProps{
    wallets: IWallets;
    walletModalOpen: boolean;
    setWalletModalOpen: (value: boolean) => void
    connectWallet: (name: string) => void
}

export const ConnectWalletModal = ({walletModalOpen, connectWallet, wallets, setWalletModalOpen}: IConnectWalletModalProps) => (
    <Modal open={walletModalOpen} footer={null} onCancel={() => {
        setWalletModalOpen(false)
    }} title="Select wallet">
        <div className='modalContent'>
            {Object.values(wallets).map(({name, title, image}: IWalletsInfo, i: number) => {
                return (
                    <button className='walletChoice' key={i} onClick={() => connectWallet(name)}>
                        <img src={image} alt={title} title={title} className="walletLogo"/>
                    </button>
                )
            })}
        </div>
    </Modal>
)

