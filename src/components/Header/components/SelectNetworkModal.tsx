import {NETWORKS} from "../../../utils/constants";
// @ts-ignore
import HederaLogo from "../../../assets/img/hedera-logo.png";
import {Modal} from "antd";
import React from "react";

export interface ISelectNetworkModalProps{
    networkModalOpen: boolean;
    setNetworkModalOpen: (value: boolean) => void
    selectNetwork: (name: string) => void
}

export const SelectNetworkModal = ({networkModalOpen, setNetworkModalOpen, selectNetwork}: ISelectNetworkModalProps) => (
    <Modal open={networkModalOpen} footer={null} onCancel={() => {
    setNetworkModalOpen(false)
}} title="Select network">
    <div className='modalContent'>
        {Object.values(NETWORKS).map((network, i) => {
            return (
                <div className='networkChoice' key={i} onClick={() => selectNetwork(network)}>
                    <img src={HederaLogo} alt={'Hedera ' + network} className="networkLogoModal"/>
                    <div className='networkName'>{'Hedera ' + network}</div>
                </div>
            )
        })}
    </div>
</Modal>
)


