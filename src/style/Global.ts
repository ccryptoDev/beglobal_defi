import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    //background: linear-gradient(45deg, #1748a0, #0b2761 ,#1c102b);
    //background-color: ${({ theme }) => theme.colors.background};
    
    // mobile nav styles
    .wZbdH, // open state
    .sc-eHfRjS, .wZbdH,
    .cYKLVU // closing state
    {
      background-color: #F8F6FB !important;
      div {
        color: #090e1a !important;
      }
      .kzhJaq, .sc-ikPAEB {
        border: none;
        background-color: #F8F6FB !important;
        .krDwpZ, .sc-jSgvzq {
          a {
            svg {
              fill: #2da9ea
            }
          }
        }
      }

      // hide menu globalPriceUsd
      > div:nth-of-type(2) > div > div:nth-of-type(1) {
        display: none;
      }
    }

    nav {
      background-color: #F8F6FB !important;
      .bMmavD, .sc-bdfBQB {
          fill: #2da9ea
      }
    }
    img {
      height: auto;
      max-width: 100%;
    }
  }

  ul {
    list-style: none; 
  }

  li {
    display: flex;
    align-items: center;
  }

  li::before {
    content: "•";
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 8px;
  }

  #StyledNavCustom {
    background: #F8F6FB !important
  }
  #StyledNavCustom a{
    color: #000000;
    font-weight:600;
  }
  #StyledNavCustom a.active {
    border-bottom: 1px solid #000000;
  }

  nav > div {
    max-width: 1410px;
  }
  nav > div > div > a > div > div {
    display: none !important;
  }
  #walletButtomCustom > div > div > span {
    -webkit-text-fill-color: #FF0000;
    color: #FF0000;
    font-weight: 600;
  }
  nav > div > div > div > div > span {
    -webkit-text-fill-color: #FF0000 !important;
    background: linear-gradient( to right,#FF0000,#FF0000 );
  }
  nav > div > div svg {
    fill:#000000;
  }



  nav > div > div > div > div > a.active > div {
    color: red;
  }
  nav > div > div > div > div > a > div {
    color: black;
    font-weight: 600;
  }

  // Desktop connect wallet button
  nav > div > div > div > div > button, 
  // Mobile connect wallet button
  nav > div > div > button {
    background: #FF0000 !important;
    font-weight: 400 !important;
    border-radius: 10px!important;
    box-shadow: none !important;

    &::after {
      display:none;
    }
  }

  nav > div > div > div > div {
    border-bottom: 0px !important;
  }


  // Notifications (the div that contains the notifications changes its index depending on if a modal is open or not)
  #root > div:nth-of-type(1) > div > div > div > div:nth-of-type(2),
  #root > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) {
    > div, > p {
      color: black;
    }
  }

  // Connect to a wallet modal
  #root > div > div:nth-of-type(2) h2 {
    color:black;
  }
  #root > div > div:nth-of-type(2) {
    background: #FFFFFF;
    box-shadow: 0px 4px 40px rgb(179 165 209 / 30%);
    border-radius: 32px;
    border: 0px;
    > div {
      background-image: none !important;
      border-bottom: 0px;
    }
  }
  #root > div > div:nth-of-type(2) > div > button {
    background: #F0ECF4;
  }
  #root > div > div:nth-of-type(2) > div > button> div {
   color:black;
  }
  //


  // connect wallet styles 
  #connect_wallet_modal, #modal_wallet_open {
    background: #FFFFFF;
    box-shadow: 0px 4px 40px rgb(179 165 209 / 30%);
    border-radius: 32px;
  }
  /* #connect_wallet_modal > div > button {
    background: #F0ECF4;
  } */
  #connect_wallet_modal > div > button > div {
    color: #000000;
  }
  #connect_wallet_modal h2, #modal_wallet_open h2 {
    color: #000000;
  }
  #connect_wallet_modal > div, #modal_wallet_open > div {
    background-image: none !important;
    border-bottom: 0px;
  }
  #connect_wallet_modal > div > a {
    color: #FF0000;
  }
  #close_dialog svg {
    fill: #000000;
  }
  #connect_wallet_modal > div > a > svg {
    fill: #000000;
  }


  #walletButtomCustom > div > div:before
  {
   background: #FF0000;
  }
  #walletButtomCustom > div > div > span
  {
   -webkit-text-fill-color: #FF0000;
   color: #FF0000;
  }
  #walletButtomCustom button{
    background: #FF0000;
    font-weight: 400;
    border-radius: 10px;
    box-shadow: none;
    :after{
      content:none;
    }
  }

  #modal_wallet_open > div > div {
      color: #FFFFFF;
  }
  .removeButton > a {
    background-color: red !important;
    color:white !important;
    width:"100%";
  }
  .buttonRemove > div > button{
    background-color: red !important;
    color:white !important;
  }
 
  // Logout dialog
  .sc-bXDkGd, .dasgDn {
    > div:nth-of-type(2) { 
      // x icon
      button > svg {
        fill: black;
      }
      // address
      > div:nth-of-type(2) > div:nth-of-type(1) {
        color: black;
      }
      // links 
      > div:nth-of-type(2) > div:nth-of-type(2) {
        a, [role="button"] {
          color: #FF0000 !important;
        }
      }
      // button
      > div:nth-of-type(2) > div:nth-of-type(3) button {
        background-color: #FF0000;
        border-color: #FF0000;
        color: white;
      }
    }
  }
  
`

export default GlobalStyle
