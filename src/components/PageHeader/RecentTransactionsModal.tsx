import React, { useMemo } from 'react'
import { CheckmarkCircleIcon, ErrorIcon, Flex, LinkExternal, Text, Modal, Button } from '@duhd4h/global-uikit'
import { useActiveWeb3React } from 'hooks'
import { getBscScanLink } from 'utils'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import Loader from 'components/Loader'
import styled, { ThemeContext } from 'styled-components'



const ModalStyles = styled(Modal)`
  background: #FFFFFF;
  box-shadow: 0px 4px 40px rgba(179, 165, 209, 0.3);
  border-radius: 32px;
  border:0px;
  h2  {
   color:black;
  }
  #close_dialog {
   background: #F0ECF4;
   border-radius: 10px;
  }
`

const ButtonGlobalStyle = styled(Button)`
  background: #FF0000;
  border-radius: 10px;
  color:white
`


type RecentTransactionsModalProps = {
  onDismiss?: () => void
  translateString: (translationId: number, fallback: string) => string
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction

  if (!hash) {
    return { icon: <Loader />, color: 'text' }
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="success" />, color: 'success' }
  }

  return { icon: <ErrorIcon color="failure" />, color: 'failure' }
}

const RecentTransactionsModal = ({ onDismiss = defaultOnDismiss, translateString }: RecentTransactionsModalProps) => {
  const { account, chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  return (
    <ModalStyles title={translateString(1202, 'Recent transactions')} onDismiss={onDismiss}>
      {!account && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text color="black" mb="8px" bold>
            Please connect your wallet to view your recent transactions
          </Text>
          <ButtonGlobalStyle variant="tertiary" scale="sm" onClick={onDismiss}>
            Close
          </ButtonGlobalStyle>
        </Flex>
      )}
      {account && chainId && sortedRecentTransactions.length === 0 && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text color="black" mb="8px" bold>
            No recent transactions
          </Text>
          <ButtonGlobalStyle variant="tertiary" scale="sm" onClick={onDismiss}>
            Close
          </ButtonGlobalStyle>
        </Flex>
      )}
      {account &&
        chainId &&
        sortedRecentTransactions.map((sortedRecentTransaction) => {
          const { hash, summary } = sortedRecentTransaction
          const { icon, color } = getRowStatus(sortedRecentTransaction)

          return (
            <>
              <Flex key={hash} alignItems="center" justifyContent="space-between" mb="4px">
                <LinkExternal href={getBscScanLink(chainId, hash, 'transaction')} color={color}>
                  {summary ?? hash}
                </LinkExternal>
                {icon}
              </Flex>
            </>
          )
        })}
    </ModalStyles>
  )
}

export default RecentTransactionsModal
