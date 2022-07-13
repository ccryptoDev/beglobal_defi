import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, TuneIcon, HistoryIcon } from '@duhd4h/global-uikit'
import useI18n from 'hooks/useI18n'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  padding: 24px;
`

const Details = styled.div`
  flex: 1;
`

const TextDescriptionStyle = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  color: #69626E;
`
const IconButtonStyle = styled(IconButton)`
  background: #F0ECF4;
  border-radius: 12px;
  margin-right:3px;
`

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details>
          <Heading color="black" fontSize="28px" mb="8px">{title}</Heading>
          {description && (
            <Text color="#69626E" fontSize="14px">
              {description}
            </Text>
          )}
        </Details>
        <IconButtonStyle variant="text" onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
          <TuneIcon width="24px" color="black" />
        </IconButtonStyle>
        <IconButtonStyle
          variant="text"
          onClick={onPresentRecentTransactions}
          title={TranslateString(1202, 'Recent transactions')}
        >
          <HistoryIcon width="24px" color="black" />
        </IconButtonStyle>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
