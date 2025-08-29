import React, { useState } from 'react'

interface TradeFormProps {
    asset: string
    buyprice: number
    sellprice: number
    balance: number
}

const TradeForm: React.FC<TradeFormProps> = ({ asset, balance, buyprice, sellprice }) => {
    const [volume, setVolume] = useState<string>('')

    const handleVolumeChange = (value: string) => {
        // Only allow numbers and decimal points
        const regex = /^\d*\.?\d*$/
        if (regex.test(value) || value === '') {
            setVolume(value)
        }
    }

    const incrementVolume = () => {
        const currentValue = parseFloat(volume) || 0
        setVolume((currentValue + 0.01).toFixed(2))
    }

    const decrementVolume = () => {
        const currentValue = parseFloat(volume) || 0
        if (currentValue > 0.01) {
            setVolume((currentValue - 0.01).toFixed(2))
        } else {
            setVolume('0.00')
        }
    }

    return (
        <div className=' p-4 flex flex-col border-b-4 border-[#162230]'>
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

            <div className=''>
                <label className='text-sm text-gray-400 font-medium'>Volume</label>
                <div className='flex items-center border border-gray-600 rounded-md bg-gray-800'>
                    <button 
                        onClick={decrementVolume}
                        className='px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 border-r border-gray-600 flex items-center justify-center min-w-[50px]'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <input 
                        className='flex-1 py-3 px-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-center text-sm'
                        type="text" 
                        placeholder='0.00'
                        value={volume}
                        onChange={(e) => handleVolumeChange(e.target.value)}
                    />
                    <button 
                        onClick={incrementVolume}
                        className='px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200 border-l border-gray-600 flex items-center justify-center min-w-[50px]'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TradeForm
