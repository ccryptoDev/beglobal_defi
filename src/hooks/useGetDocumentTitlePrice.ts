import { useEffect } from 'react'
import useGetGlobalBusdLpPrice from 'utils/useGetGlobalBusdLpPrice'

const useGetDocumentTitlePrice = () => {
  const cakePriceBusd = useGetGlobalBusdLpPrice()

  const cakePriceBusdString =
    Number.isNaN(cakePriceBusd) || cakePriceBusd === 0 || !cakePriceBusd
      ? ''
      : ` - $${cakePriceBusd.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}`

  useEffect(() => {
    document.title = `BeGlobal${cakePriceBusdString}`
  }, [cakePriceBusdString])
}
export default useGetDocumentTitlePrice
