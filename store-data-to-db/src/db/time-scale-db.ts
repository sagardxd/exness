import pkg from 'pg'
import type { Candle, Trade, TradeData } from '../types/time-scale.types.ts';
const { Client } = pkg;

class TradesDB {
    private client: typeof Client.prototype;
    private connected: boolean;

    constructor(private connectionString: string) {
        this.client = new Client({ connectionString });
        this.connected = false;
    }

    // Connect once
    private async connect(): Promise<void> {
        if (!this.connected) {
            try {
                await this.client.connect();
                this.connected = true
                console.log('✅ Connected to DB');
            } catch (err) {
                console.error('❌ DB connection failed:', err);
                throw err;
            }
        }
    }

    // Insert trades - NO refresh
    async insert(tradesData: TradeData[]): Promise<void> {
        await this.connect();
        try {
            const trades: Trade[] = tradesData.map(t => ({
                token: t.s,
                price: parseFloat(t.p),
                timestamp: new Date(t.T),
                volume: parseFloat(t.q)
            }));

            const values = trades
                .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
                .join(', ');

            const params = trades.flatMap(t => [t.token, t.price, t.timestamp, t.volume]);

            await this.client.query(
                `INSERT INTO trades (token, price, timestamp, volume) VALUES ${values}`,
                params
            );

            console.log(`✅ Inserted ${trades.length} trades`);
        } catch (err) {
            console.error('❌ Failed to insert trades:', err);
            throw err;
        }
    }

    // Get candles from materialized views
    async getCandles(token: string, interval: string, limit = 100): Promise<Candle[]> {
        await this.connect();
        try {
            const result = await this.client.query<Candle>(
                `SELECT * FROM candles_${interval} WHERE token = $1 ORDER BY candle_start DESC LIMIT $2`,
                [token, limit]
            );

            console.log(`✅ Fetched ${result.rows.length} candles for ${token}`);
            return result.rows;
        } catch (err) {
            console.error('❌ Failed to get candles:', err);
            throw err;
        }
    }

    // Refresh views manually
    async refresh(interval: string): Promise<void> {
        await this.connect();
        try {
            await this.client.query(`REFRESH MATERIALIZED VIEW candles_${interval}`);
            console.log(`🔄 Refreshed view candles_${interval}`);
        } catch (err) {
            console.error('❌ Failed to refresh materialized views:', err);
            throw err;
        }
    }

    // Close connection
    async close(): Promise<void> {
        if (this.connected) {
            try {
                await this.client.end();
                this.connected = false;
                console.log('✅ DB connection closed');
            } catch (err) {
                console.error('❌ Failed to close DB connection:', err);
                throw err;
            }
        }
    }
}

export default TradesDB;
