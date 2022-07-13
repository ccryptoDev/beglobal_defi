import React from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Button, ButtonProps, useWalletModal} from '@duhd4h/global-uikit'
import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'


const ButtonUnlockWalletStyles = styled.div`
   background: #FF0000;
   border-radius: 16px;
   > button {
    background:red;
    box-shadow:none;
    font-weight: 500;
    border-radius: 16px;
  }
`


const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
  	<ButtonUnlockWalletStyles>
	    <Button onClick={onPresentConnectModal} variant="full_gradient" {...props}>
	      {TranslateString(292, 'Unlock Wallet')}
	    </Button>
    </ButtonUnlockWalletStyles>
  )
}

export default UnlockButton
