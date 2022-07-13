import React from 'react'
import { Trade, TradeType } from '@duhd4h/global-sdk'
import { Card, CardBody, Text } from '@duhd4h/global-uikit'
import useI18n from 'hooks/useI18n'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import styled from 'styled-components'
const StyledNav = styled.div`
  z-index: 1;
  margin-bottom: 20px;
  background: #F0ECF4;
  box-shadow: 0px 2px 6px rgba(179, 165, 209, 0.15), 0px 4px 40px rgba(179, 165, 209, 0.3);
  border-radius: 20px;
  padding:8px;
  color:gray !important;
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
  /* a.cTsiiO {
    background: #F0ECF4;
  } */

`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const TranslateString = useI18n()

  return (
    <StyledNav>
      <CardBody>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="gray">
              {isExactIn ? TranslateString(1210, 'Minimum received') : TranslateString(220, 'Maximum sold')}
            </Text>
            <QuestionHelper
              text={TranslateString(
                202,
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
              )}
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px" color="gray">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize='14px' color="gray">{TranslateString(226, 'Price Impact')}</Text>
            <QuestionHelper
              text={TranslateString(
                224,
                'The difference between the market price and estimated price due to trade size.'
              )}
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="gray">{TranslateString(228, 'Liquidity Provider Fee')}</Text>
            <QuestionHelper
              text={TranslateString(
                230,
                'For each trade a 0.036% fee is paid. 0.005% goes to liquidity providers and 0.086% goes to the BeGlobal treasury.'
              )}
            />
          </RowFixed>
          <Text fontSize="14px" color="gray">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </CardBody>
    </StyledNav>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const TranslateString = useI18n()
  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn >
                <RowFixed color="gray">
                  <Text fontSize="14px" color="gray">Route</Text>
                  <QuestionHelper
                    text={TranslateString(
                      999,
                      'Routing through these tokens resulted in the best price for your trade.'
                    )}
                  />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
