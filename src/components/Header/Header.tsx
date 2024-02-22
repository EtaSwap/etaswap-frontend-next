import React, { useState } from 'react'
// @ts-ignore
import Logo from '../../logo.svg'
import {Link} from 'react-router-dom'
// @ts-ignore
import Disconnect from '../../assets/img/disconnect.png'
import './Header.css'
import {ConnectWalletModal} from "./components/ConnectWalletModal";
import {IWallet, IWallets} from "../../models";

export interface IHeaderProps {
    wallet: IWallet;
    wallets: IWallets;
}

function Header({ wallet, wallets }: IHeaderProps) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const disconnectWallet = (name: string) => {
      wallets[name].instance.disconnect();
  }

  const connectWallet = (name: string) => {
    if (wallet.address) {
        if (wallet.name === name) {
            return null;
        }
        wallets[wallet.name].instance.disconnect();
    }
    wallets[name].instance.connect();
    setWalletModalOpen(false);
  }

  return (
    <header className='header'>
      <nav className='leftH'>
        <Link to='/'>
          <img src={Logo} alt='η' className='logo' title='EtaSwap' />
        </Link>
        <Link to='/' className='link'>Swap</Link>
        <Link to='/tokens' className='link'>Tokens</Link>
        <a href='https://docs.etaswap.com/' target='_blank' className='link'>Docs</a>
      </nav>
      <div className='rightH'>
        {!!wallet?.address
          ? <>
            <img src={wallets[wallet.name].icon} className='walletIcon' alt={wallets[wallet.name].title} />
            {wallet?.address}
            <div className='connectButton' onClick={() => disconnectWallet(wallet.name)}>
              <img className='disconnectIcon' src={Disconnect} alt='disconnect'/>
            </div>
          </>
          : <div className='connectButton' onClick={() => setWalletModalOpen(true)}>Connect Wallet</div>
        }
      </div>
      <ConnectWalletModal connectWallet={connectWallet} walletModalOpen={walletModalOpen} wallets={wallets} setWalletModalOpen={setWalletModalOpen} />
    </header>
  )
}

export default Header
