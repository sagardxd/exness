import { subscribeToAsset } from './redis-client';

// Subscribe to ETH price updates
subscribeToAsset("ETH", (data) => {
    console.log("ETH price update:", data);
});

// Subscribe to BTC price updates  
subscribeToAsset("BTC", (data) => {
    console.log("BTC price update:", data);
}); 