import React from 'react'
import './Social.css'

function Social() {
  return (
    <>
      <a className="social__link" href="https://twitter.com/eta_swap" target="_blank" title="Twitter">
        <img className="social__image" src="/icon_twitter.svg" alt="Twitter" />
      </a>
      <a className="social__link" href="https://t.me/etaswap" target="_blank" title="Telegram">
        <img className="social__image" src="/icon_telegram.svg" alt="Telegram" />
      </a>
      <a className="social__link" href="https://www.reddit.com/r/etaswap/" target="_blank" title="Reddit">
        <img className="social__image" src="/icon_reddit.svg" alt="Reddit" />
      </a>
      <a className="social__link" href="https://discord.gg/8uHPAT4Nhx" target="_blank" title="Discord">
        <img className="social__image" src="/icon_discord.svg" alt="Discord" />
      </a>
      <a className="social__link" href="https://github.com/EtaSwap" target="_blank" title="GitHub">
        <img className="social__image" src="/icon_github.svg" alt="GitHub" />
      </a>
    </>
  )
}

export default Social
