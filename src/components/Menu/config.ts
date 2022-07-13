import { MenuEntry } from '@duhd4h/global-uikit'
import {
  BASE_MAIN_FRONTEND_URL_FARMS,
  BASE_MAIN_FRONTEND_URL_HOME,
  BASE_MAIN_FRONTEND_URL_POOLS_GLOBAL,
  BASE_MAIN_FRONTEND_URL_POOLS_TOKEN,
  BASE_MAIN_FRONTEND_URL_VAULTS
} from '../../config'

const config: MenuEntry[] = [
  {
    label: 'Home',
    href: BASE_MAIN_FRONTEND_URL_HOME,
  },
  {
    label: 'Exchange',
    href: '/swap',
  },
  {
    label: 'Liquidity',
    href: '/pool',
  },
  {
    label: 'Farms',
    href: BASE_MAIN_FRONTEND_URL_FARMS,
  },
  {
    label: 'Pools',
    href: BASE_MAIN_FRONTEND_URL_POOLS_GLOBAL,
  },
  // {
  //   label: 'Stake Token',
  //   href: BASE_MAIN_FRONTEND_URL_POOLS_TOKEN,
  // },
  // {
  //   label: 'Optimizer',
  //   href: BASE_MAIN_FRONTEND_URL_VAULTS,
  // },
  {
    label: 'BeGlobal',
    href: 'https://beglobal.finance/',
  },
  {
    label: 'Docs',
    href: 'https://beglobal-finance.gitbook.io/beglobal/',
  }
]

export default config
