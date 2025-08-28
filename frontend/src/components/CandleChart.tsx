import React, { useEffect } from 'react'

const CandleChart = () => {
    const [currentToken, setCurrentToken] = React.useState("BTCUSDT");
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);

    const chartContainerRef = React.useRef<HTMLDivElement>(null);
    const widgetRef = React.useRef<any>(null);

    useEffect(() => {

        if (window.TradingView) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            setIsScriptLoaded(true);
        };
        document.body.appendChild(script);

        return () => {  
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!isScriptLoaded  || !chartContainerRef.current) return;

        if (widgetRef.current) {
            widgetRef.current.remove();
            widgetRef.current = null;
        }

        chartContainerRef.current.innerHTML = '';

        widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: currentToken,
            interval: '15',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'ChartContainer',
            hide_side_toolbar: false,
            
        });

    }, [isScriptLoaded]);

    return (
        <div>
            <div className={`bg-gray-900 rounded-lg shadow-md p-4 
                            ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative'}`}
            >
                Exness
            </div>
            <div className={`bg-gray-900 ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[500px]'} mt-4 rounded-lg shadow-md p-4`}>
                <div
                    ref={chartContainerRef}
                    id='ChartContainer'
                    className='w-full h-full'
                    >

                </div>
            </div>
        </div>
    )
}

export default CandleChart
