import React from 'react'
import styled from 'styled-components'
import { Card, GradientBorderBox } from '@duhd4h/global-uikit'

export const BodyWrapper = styled(Card)`
  position: relative;
  max-width: 436px;
  width: 100%;
  z-index: 5;
  background: #FFFFFF;
  box-shadow: 0px 2px 6px rgba(179, 165, 209, 0.15), 0px 4px 40px rgba(179, 165, 209, 0.3);
  border-radius: 32px;
  
`

export const GradientBorderBoxWrapper = styled.div`
    display: inline-flex;
    position: relative;
    z-index: 0;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <GradientBorderBoxWrapper><BodyWrapper>{children}</BodyWrapper></GradientBorderBoxWrapper>
}
