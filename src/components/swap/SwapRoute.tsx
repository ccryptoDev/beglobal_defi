import { Trade } from '@duhd4h/global-sdk'
import React, { Fragment, memo, useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex, Text } from '@duhd4h/global-uikit'
import { ThemeContext } from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useContext(ThemeContext)
  return (
    <Flex
      px="1rem"
      py="0.5rem"
      my="0.5rem"
      style={{ borderRadius: '1rem', backgroundColor:"#F0ECF4", color:"gray"}}
      flexWrap="wrap"
      justifyContent="space-evenly"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <Flex my="0.5rem" alignItems="center" style={{ flexShrink: 0}}>
              <CurrencyLogo currency={token} size="1.5rem" />
              <Text fontSize="14px" color="gray" ml="0.5rem">
                {token.symbol}
              </Text>
            </Flex>
            {isLastItem ? null : <ChevronRight color="gray" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
