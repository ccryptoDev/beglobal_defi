import {useState, useEffect} from 'react'

const useGetCustomPrice = () => {
    const [customPrice, setCustomPrice] = useState();

    function round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(100));
        return Math.round(m) / 100 * Math.sign(num);
        
    }

    useEffect(() => {
      fetch("https://api.pancakeswap.info/api/v2/tokens/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82")
      .then( res => res.json())
      .then( res => {
          console.log(res.data)
          setCustomPrice(res.data.price)
        })
    }, [])
    // console.log(customPrice)

    // console.log(round(customPrice))
    
    return customPrice ? round(customPrice) : undefined
       
    
}

export default useGetCustomPrice