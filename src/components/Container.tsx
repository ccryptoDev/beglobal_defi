import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 100vh;
  width: 100%;
  padding: 32px 16px;
  padding-top: 10vh;
  justify-content: normal;
  background-color:#ffffff;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/background/bg_partneships.png');
    background-repeat: no-repeat;
    background-size: 100% 65%;
    background-position: 100% 100%;
  }
`

export default Container
