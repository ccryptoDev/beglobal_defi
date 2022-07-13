import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@duhd4h/global-uikit'
import useI18n from 'hooks/useI18n'

const StyledNav = styled.div`
  z-index: 1;
  margin-bottom: 20px;
  background: #FFFFFF;
  box-shadow: 0px 2px 6px rgba(179, 165, 209, 0.15), 0px 4px 40px rgba(179, 165, 209, 0.3);
  border-radius: 20px;
  padding:8px;
  > div:before {
    content:none;
  }
  a {
    color:black;
    border-radius: 16px;
    -webkit-text-fill-color:black;
    box-shadow:none;
    font-size: 16px;
  }
  .illuminateButton{
    background: #F0ECF4 !important;
  }
  /* a.cTsiiO {
    background: #F0ECF4;
  } */

`



function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="md" variant="full_gradient">
        <div className={activeIndex == 0 ? 'illuminateButton' : ''}>
          <ButtonMenuItem style={{ padding: '0 40px' }} id="swap-nav-link" to="/swap" as={Link}>
            {TranslateString(1142, 'Swap')}
          </ButtonMenuItem>
        </div>
        <div  className={activeIndex == 1 ? 'illuminateButton' : ''}>
          <ButtonMenuItem style={{ padding: '0 40px' }} id="pool-nav-link" to="/pool" as={Link}>
            {TranslateString(262, 'Liquidity')}
          </ButtonMenuItem>
        </div>
        <ButtonMenuItem
          style={{ padding: '0 40px' }}
          id="pool-nav-link"
          as="a"
          href="https://www.binance.org/en/bridge?utm_source=BeGlobalSwap"
          target="_blank"
          rel="noreferrer noopener"
        >
          Bridge
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
