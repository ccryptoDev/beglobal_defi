import { CurrencyAmount, JSBI, Token, Trade } from '@duhd4h/global-sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text, Link } from '@duhd4h/global-uikit'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from 'components/AddressInputPanel'
import Card, { GreyCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import ConfirmSwapModal from 'components/swap/ConfirmSwapModal'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { AutoRow, RowBetween } from 'components/Row'
import AdvancedSwapDetailsDropdown from 'components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from 'components/swap/styleds'
import TradePrice from 'components/swap/TradePrice'
import TokenWarningModal from 'components/TokenWarningModal'
import SyrupWarningModal from 'components/SyrupWarningModal'
import SafeMoonWarningModal from 'components/SafeMoonWarningModal'
import ProgressSteps from 'components/ProgressSteps'
import Container from 'components/Container'

import { INITIAL_ALLOWED_SLIPPAGE } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { LinkStyledButton } from 'components/Shared'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import Loader from 'components/Loader'
import useI18n from 'hooks/useI18n'
import PageHeader from 'components/PageHeader'
import ConnectWalletButton from 'components/ConnectWalletButton'
import AppBody from '../AppBody'
import {ReactComponent as GlobbyIMG} from '../../assets/globi_hug.svg'
import {ReactComponent as GlobbyIZQ} from '../../assets/globi_brazo_izq.svg'
import {ReactComponent as GlobbyDER} from '../../assets/globi_brazo_der.svg'
import {ReactComponent as Block} from '../../assets/groupR.svg'
import {ReactComponent as BlockL} from '../../assets/groupL.svg'
// import {ReactComponent as BlockLeft} from '../../assets/groupL.png'

const Separator = styled.div`
  margin: auto;
  width: 90%;
  height: 1px;
  background: #F0ECF4;
`
const Title = styled.div`
  color: black;
  font-size: 35px;
  margin-bottom: 50px;
  font-weight: 600;
`
const AppBodyStyle = styled(AppBody)`
  ${({ theme }) => theme.mediaQueries.sm} {
   
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    
  }
`

const IconButtonMiddleStyle = styled(IconButton)`
   background:red;
`



const Swap = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const TranslateString = useI18n()
  const [modalCountdownSecondsRemaining, setModalCountdownSecondsRemaining] = useState(5)
  const [disableSwap, setDisableSwap] = useState(false)
  const [hasPoppedModal, setHasPoppedModal] = useState(false)
  const [interruptRedirectCountdown, setInterruptRedirectCountdown] = useState(false)

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [transactionWarning, setTransactionWarning] = useState<{
    selectedToken: string | null
    purchaseType: string | null
  }>({
    selectedToken: null,
    purchaseType: null,
  })
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const handleConfirmWarning = () => {
    setTransactionWarning({
      selectedToken: null,
      purchaseType: null,
    })
  }

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  // Manage disabled trading pairs that should redirect users to V2
  useEffect(() => {
    const disabledSwaps: string[] = []
    const inputCurrencySymbol = currencies[Field.INPUT]?.symbol || ''
    const outputCurrencySymbol = currencies[Field.OUTPUT]?.symbol || ''
    const doesInputMatch = disabledSwaps.includes(inputCurrencySymbol)
    const doesOutputMatch = disabledSwaps.includes(outputCurrencySymbol)

    if (doesInputMatch && doesOutputMatch) {
      // Prevent infinite re-render of modal with this condition
      if (!hasPoppedModal) {
        setHasPoppedModal(true)
      }

      // Controls the swap buttons being disabled & renders a message
      setDisableSwap(true)

      const tick = () => {
        setModalCountdownSecondsRemaining((prevSeconds) => prevSeconds - 1)
      }
      const timerInterval = setInterval(() => tick(), 1000)

      if (interruptRedirectCountdown) {
        // Reset timer if countdown is interrupted
        clearInterval(timerInterval)
        setModalCountdownSecondsRemaining(5)
      }

      if (modalCountdownSecondsRemaining <= 0) {
        window.location.href = 'https://exchange.pancakeswap.finance/#/swap'
      }

      return () => {
        clearInterval(timerInterval)
      }
    }

    // Unset disableSwap state if the swap inputs & outputs dont match disabledSwaps
    setDisableSwap(false)
    return undefined
  }, [currencies, hasPoppedModal, modalCountdownSecondsRemaining, interruptRedirectCountdown])

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, swapErrorMessage: undefined, txHash: undefined }))
    swapCallback()
      .then((hash) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }))
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }))
      })
  }, [priceImpactWithoutFee, swapCallback, setSwapState])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }))

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  // This will check to see if the user has selected Syrup or SafeMoon to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForWarning = useCallback(
    (selected: string, purchaseType: string) => {
      if (['SYRUP', 'SAFEMOON'].includes(selected)) {
        setTransactionWarning({
          selectedToken: selected,
          purchaseType,
        })
      }
    },
    [setTransactionWarning]
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setHasPoppedModal(false)
      setInterruptRedirectCountdown(false)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      if (inputCurrency.symbol === 'SYRUP') {
        checkForWarning(inputCurrency.symbol, 'Selling')
      }
      if (inputCurrency.symbol === 'SAFEMOON') {
        checkForWarning(inputCurrency.symbol, 'Selling')
      }
    },
    [onCurrencySelection, setApprovalSubmitted, checkForWarning]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      setHasPoppedModal(false)
      setInterruptRedirectCountdown(false)
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      if (outputCurrency.symbol === 'SYRUP') {
        checkForWarning(outputCurrency.symbol, 'Buying')
      }
      if (outputCurrency.symbol === 'SAFEMOON') {
        checkForWarning(outputCurrency.symbol, 'Buying')
      }
    },
    [onCurrencySelection, checkForWarning]
  )

  return (
    <Container>
      <Title>Best swapping fees in the market!</Title>
       <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SyrupWarningModal
        isOpen={transactionWarning.selectedToken === 'SYRUP'}
        transactionType={transactionWarning.purchaseType}
        onConfirm={handleConfirmWarning}
      />
      <ImageRight/>
      <SafeMoonWarningModal isOpen={transactionWarning.selectedToken === 'GLOBAL'} onConfirm={handleConfirmWarning} />
      <CardNav />
      <Globby>
      <AppBodyStyle>
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <PageHeader
            title={TranslateString(8, 'Exchange')}
            description={TranslateString(1192, 'Trade tokens in an instant')}
          />
          <Separator />
          <CardBody>
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade
                    ? TranslateString(194, 'From (estimated)')
                    : TranslateString(76, 'From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable>
                    <IconButtonMiddleStyle
                      variant="full_gradient"
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                      }}
                      style={{ borderRadius: '50%' }}
                      scale="sm"
                    >
                      <ArrowDownIcon color="white" width="24px" />
                    </IconButtonMiddleStyle>
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap && trade
                    ? TranslateString(196, 'To (estimated)')
                    : TranslateString(80, 'To')
                }
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.colors.textSubtle} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {showWrap ? null : (
                <Card padding=".25rem .75rem 0 .75rem" borderRadius="20px">
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontSize="14px">{TranslateString(1182, 'Price')}</Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Text fontSize="14px" color="black">{TranslateString(88, 'Slippage Tolerance')}</Text>
                        <Text fontSize="14px" color="black">{allowedSlippage / 100}%</Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              {!account ? (

                <ConnectWalletButton width="100%" />

              ) : showWrap ? (

                <Button id="swap-button" disabled={Boolean(wrapInputError)} onClick={onWrap} width="100%">
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                </Button>

              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center', color:'black !important' }}>
                  <Text mb="4px">
                    <span style={{color:"gray"}}>
                    {TranslateString(1194, 'Insufficient liquidity for this trade.')}</span></Text>
                </GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button id="swap-button"
                    onClick={approveCallback}
                    disabled={disableSwap || approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    style={{ width: '48%' }}
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'full_gradient'}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      'Approved'
                    ) : (
                      `Approve ${currencies[Field.INPUT]?.symbol}`
                    )}
                  </Button>
                  <Button 
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    style={{ width: '48%' }}
                    id="swap-button"
                    disabled={
                      disableSwap ||
                      !isValid ||
                      approval !== ApprovalState.APPROVED ||
                      (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'full_gradient'}
                  >
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Button>
                </RowBetween>
              ) : (
                <Button
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={
                    disableSwap || !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError
                  }
                  variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'full_gradient'}
                  width="100%"
                >
                  {swapInputError ||
                    (priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact Too High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                </Button>
              )}
              {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBodyStyle>
      </Globby>
      <ImageLeft />
      <AdvancedSwapDetailsDropdown trade={trade} />
    </Container>
  )
}

export default Swap

const ImageLeft = styled.div`
  background-image: url("/images/groupL.png");
  width: 272px;
  height: 178px;
  margin: -110px 0 0 -350px;
`;

const ImageRight = styled.div`
  background-image: url("/images/groupR.png");
  width: 152px;
  height: 272px;
  z-index: 0;
  position: absolute;
  margin: 50px 0 0 450px;
`;

const Globby = styled.div`
   
  :before {
    content:none;
  }
  
  position:relative;
  object-fit:contain;
  width:436px;
  background:transparent;

  #customSvg{
    height:600px;
    position:absolute;
    width:522px;
    top:-240px;
    left:-45px;
  }

  #customIzq{
    position:absolute;
    top:66px;
    left:-45px;
    z-index:2;
  }

  #customDer{
    position:absolute;
    right:-41px;
    top:32px;
    z-index:2;
  }

  #swap-page{
    background: #FFFFFF;
    box-shadow: 0px 2px 6px rgba(179, 165, 209, 0.15), 0px 4px 40px rgba(179, 165, 209, 0.3);
    border-radius: 32px;
  }

  #swap-button{
    background: red;
    color:white;
    border-radius: 16px;
  }

  > div > div{
    background:white; 
    box-shadow: 0px 2px 6px rgba(179, 165, 209, 0.15), 0px 4px 40px rgba(179, 165, 209, 0.3);
    border-radius: 32px;
  }

  > div:before {
    content:none; 
  }



`
