import pkg from '../../node_modules/@types/pg/index.js'
import type { Candle } from '../types/time-scale.types.js';
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
                this.connected = true;
                console.log('✅ Connected to DB');
            } catch (err) {
                console.error('❌ DB connection failed:', err);
                throw err;
            }
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
