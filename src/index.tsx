import React, { StrictMode } from 'react'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import ReactDOM from 'react-dom'
import { ResetCSS } from '@duhd4h/global-uikit'
import GlobalStyle from './style/Global'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import ToastListener from './components/ToastListener'
import Providers from './Providers'
import 'inter-ui'
import './i18n'

Sentry.init({
  dsn: "https://2b9ba026ec4442e8859919ecd97b02d1@o1074190.ingest.sentry.io/6073839",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV !== 'production' ? 'prod' : 'dev',
});

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
   localStorage?.removeItem('redux_localstorage_simple_lists')
})

ReactDOM.render(
  <StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
        <ToastListener />
      </>
      <ResetCSS />
      <GlobalStyle />
      <App />
    </Providers>
  </StrictMode>,
  document.getElementById('root')
)
