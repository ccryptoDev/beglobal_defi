import { Currency, CurrencyAmount, Fraction, Percent } from '@duhd4h/global-sdk'
import React from 'react'
import { Button, Text } from '@duhd4h/global-uikit'
import { TranslateString } from 'utils/translateTextHelpers'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween>
        <Text style={{ color: 'black' }}>{currencies[Field.CURRENCY_A]?.symbol} Deposited</Text>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <Text style={{ color: 'black' }}>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text style={{ color: 'black' }}>{currencies[Field.CURRENCY_B]?.symbol} Deposited</Text>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <Text style={{ color: 'black' }}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text style={{ color: 'black' }}>Rates</Text>
        <Text style={{ color: 'black' }}>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </Text>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <Text style={{ color: 'black' }}>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text style={{ color: 'black' }}>Share of Pool:</Text>
        <Text style={{ color: 'black' }}>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </RowBetween>
      <Button mt="20px" style={{ backgroundColor: '#FF0000', color: 'white' }} onClick={onAdd}>
        {noLiquidity ? TranslateString(250, 'Create Pool & Supply') : TranslateString(252, 'Confirm Supply')}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
