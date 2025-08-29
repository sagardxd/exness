import React from 'react'

interface TradeFormProps {
    asset: string
    buyprice: number
    sellprice: number
    balance: number
}

const TradeForm: React.FC<TradeFormProps> = ({ asset, balance, buyprice, sellprice }) => {
    return (
        <div className='w-1/5 p-4  flex flex-col space-y-4 border-b-4  border-[#162230]'>
            <div className='flex justify-between mb-2'>
                <div className='text-md text-gray-400'>{asset}</div>
                <div className='flex gap-8 text-[10px] uppercase tracking-wider text-gray-400'>
                </div>
            </div>
            <div className='flex gap-2'>
                <button className='w-full py-3 rounded-md font-semibold transition-colors duration-200 bg-rose-600 text-white hover:bg-rose-500'>
                    <div>Sell</div>
                    <div className='text-sm font-medium'>{buyprice}</div>
                </button>
                <button className='w-full py-3 rounded-md font-semibold transition-colors duration-200 bg-emerald-600 text-white hover:bg-emerald-500'>
                    <div>Buy</div>
                    <div className='text-sm font-medium'>{sellprice}</div>
                </button>
            </div>

            <div className='flex w-full'>
                <input className='w-full py-2 px-2' type="text" placeholder='volume' />
                <div className='p-2'>-</div>
                <div >+</div>
            </div>
        </div>
    )
}

export default TradeForm
