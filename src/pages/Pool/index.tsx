//@ts-nocheck
import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@duhd4h/global-sdk'
import { Button, CardBody, GradientBorderBox, Text } from '@duhd4h/global-uikit'
import CardNav from 'components/CardNav'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { StyledGradientLink, StyledInternalLink } from 'components/Shared'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import Container from 'components/Container'
import { Link } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/swap/styleds'
import useI18n from 'hooks/useI18n'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'
import {ReactComponent as GlobbyIMG} from '../../assets/globi_hug.svg'
import {ReactComponent as GlobbyIZQ} from '../../assets/globi_brazo_izq.svg'
import {ReactComponent as GlobbyDER} from '../../assets/globi_brazo_der.svg'

const Title = styled.div`
  color: black;
  font-family: 'Poppins';
  font-size: 30px;
  margin-bottom: 50px;
  font-weight: 600;
`

const ButtonWrapper = styled(Button)`
  background-color: #FFECEC;
  
    align-items: center;
    border: 0;
    border-radius: 8px;
    border: 1px solid #FFDBDB;
    /* box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset; */
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    letter-spacing: 0.03em;
    line-height: 1;
    opacity: 1;
    outline: 0;
    /* transition: background-color 0.2s,opacity 0.2s; */
    height: 48px;
    padding: 0 24px;
    color: #FF0000;
    margin-bottom: 16px;
`

const GradientWrapper = styled.div`
    background-color: #F0ECF4;
    border-radius: 16px;
    padding: 40px;
    display: inline-flex;
    position: relative;
    z-index: 0;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const TranslateString = useI18n()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <Container>
      <Title color="black">Best swapping fees in the market!</Title>
      <ImageRight/>
      <CardNav activeIndex={1} />
      <Globby>
        {/*<GlobbyIMG id="customSvg"/>*/}
        {/*<GlobbyIZQ id="customIzq"/>*/}
        {/*<GlobbyDER id="customDer"/>*/}
      <AppBody>
        <PageHeader
          title={TranslateString(262, 'Liquidity')}
          description={TranslateString(1168, 'Add liquidity to receive LP tokens')}
        >
          <ButtonWrapper id="join-pool-button" as={Link} to="/add/BNB" mb="16px" variant="danger">
            {TranslateString(168, 'Add Liquidity')}
          </ButtonWrapper>
        </PageHeader>
        <AutoColumn gap="lg" justify="center">
          <CardBody>
            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <RowBetween padding="0 8px">
                <Text color="black">{TranslateString(107, 'Your Liquidity')}</Text>
                <Question
                  text={TranslateString(
                    1170,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </RowBetween>

              {!account ? (
                <GradientWrapper style={{ padding: '40px' }}>
                  <Text color="black" textAlign="center">
                    {TranslateString(156, 'Connect to a wallet to view your liquidity.')}
                  </Text>
                </GradientWrapper>
              ) : v2IsLoading ? (
                <GradientWrapper style={{ padding: '40px' }}>
                  <Text color="textDisabled" textAlign="center">
                    <Dots>Loading</Dots>
                  </Text>
                </GradientWrapper>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <GradientWrapper style={{ padding: '40px' }}>
                  <Text color="textDisabled" textAlign="center">
                    {TranslateString(104, 'No liquidity found.')}
                  </Text>
                </GradientWrapper>
              )}

              <div>
                <Text color="#69626E" fontSize="14px" style={{ padding: '.5rem 0 .5rem 0' }}>
                  {TranslateString(106, "Don't see a pool you joined?")}{' '}
                  <StyledGradientLink id="import-pool-link" to="/find">
                    {TranslateString(108, 'Import it.')}
                  </StyledGradientLink>
                </Text>
                <Text color="#69626E" fontSize="14px" style={{ padding: '.5rem 0 .5rem 0' }}>
                  {TranslateString(1172, 'Or, if you staked your LP tokens in a farm, unstake them to see them here.')}
                </Text>
              </div>
            </AutoColumn>
          </CardBody>
        </AutoColumn>
      </AppBody>
      </Globby>
      <ImageLeft />
    </Container>
  )
}

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
  //margin-top:220px;
  position:relative;
  object-fit:contain;
  width:436px;

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
`