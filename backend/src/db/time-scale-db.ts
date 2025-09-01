import pkg from 'pg'
import type { Candle } from '../types/time-scale.types.ts';
const { Client } = pkg;

class TradesDB {
    private connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    // Create a new client for each operation
    private createClient(): typeof Client.prototype {
        return new Client({ connectionString: this.connectionString });
    }

    // Get candles from materialized views
    async getCandles(token: string, interval: string, limit = 100): Promise<Candle[]> {
        const client = this.createClient();
        try {
            await client.connect();
            const result = await client.query<Candle>(
                `SELECT * FROM candles_${interval} WHERE token = $1 ORDER BY candle_start DESC LIMIT $2`,
                [token, limit]
            );

            console.log(`✅ Fetched ${result.rows.length} candles for ${token}`);
            return result.rows;
        } catch (err) {
            console.error('❌ Failed to get candles:', err);
            throw err;
        } finally {
            await client.end();
        }
    }

    // Method kept for backwards compatibility
    async close(): Promise<void> {
        // No-op as clients are now managed per operation
    }
}

export default TradesDB;
