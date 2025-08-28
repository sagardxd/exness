declare global {
    interface Window {
        TradingView: {
            widget: new (config: any) => unknown;
        };
    }
}

export {};