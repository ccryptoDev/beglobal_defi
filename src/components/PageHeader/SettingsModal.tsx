import React from 'react'
import { Modal } from '@duhd4h/global-uikit'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'
import styled from 'styled-components'


const ModalStyles = styled(Modal)`
  background: #FFFFFF;
  box-shadow: 0px 4px 40px rgba(179, 165, 209, 0.3);
  border-radius: 32px;
  border:0px;
  border-bottom: 0 !important;
  h2  {
   color:black;
  }
  #close_dialog {
   background: #F0ECF4;
   border-radius: 10px;
  }
  button{
    background: #F0ECF4;
    border-radius: 16px;
    border:0px;
    box-shadow:none;
  }
  button.cTsiiO{
    background: #FF0000;
  }
  input{
    background: #F0ECF4;
    border-radius: 16px;
    color:black;
    box-shadow:none;
  }
`



type SettingsModalProps = {
  onDismiss?: () => void
  translateString: (translationId: number, fallback: string) => string
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal = ({ onDismiss = defaultOnDismiss, translateString }: SettingsModalProps) => {
  return (
    <ModalStyles title={translateString(1200, 'Settings')} onDismiss={onDismiss}>
        <SlippageToleranceSetting translateString={translateString} />
        <TransactionDeadlineSetting translateString={translateString} />
    </ModalStyles>
  )
}

export default SettingsModal

const Top = styled.div`
  position: relative;
  &:nth-child(){
    position:absolute;
    z-index:3 !important;
  }
  
`
