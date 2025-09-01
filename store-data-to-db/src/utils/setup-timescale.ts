import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL client configuration
const client = new Client({ connectionString: "postgresql://sagardxd:sagardxd@localhost:5432/exness" });

async function setupTimescale() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Enable TimescaleDB extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS timescaledb;`);

    // Create trades table only if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id BIGSERIAL,
        token VARCHAR(20) NOT NULL,
        price BIGINT NOT NULL,
        volume DECIMAL(20,8) NOT NULL,
        decimals INT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (timestamp, token, id)
      );
    `);
    console.log('Ensured trades table exists');

    // Convert to hypertable only if not already one
    try {
      await client.query(`SELECT create_hypertable('trades', 'timestamp');`);
      console.log('Created hypertable');
    } catch (err: any) {
      if (err.message.includes('already a hypertable')) {
        console.log('Hypertable already exists, returning');
        return;
      } else {
        throw err;
      }
    }


    // Create index for trades table
    await client.query(`
      CREATE INDEX idx_trades_token_timestamp ON trades (token, timestamp DESC);
    `);

    // Create materialized views
    const intervals = [1, 5, 10, 15, 30];
    for (const i of intervals) {
      await client.query(`
        CREATE MATERIALIZED VIEW candles_${i}m 
        WITH (timescaledb.continuous) AS 
        SELECT
          token,
          time_bucket('${i} minutes', timestamp) AS candle_start,
          time_bucket('${i} minutes', timestamp) + INTERVAL '${i} minutes' AS candle_end,
          FIRST(price, timestamp) AS open,
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, timestamp) AS close,
          SUM(volume) AS volume,
          COUNT(*) AS trade_count
        FROM trades
        GROUP BY token, time_bucket('${i} minutes', timestamp)
        ORDER BY token, candle_start DESC;
      `);

      // Create index for each materialized view
      await client.query(`
        CREATE INDEX idx_candles_${i}m_token_time ON candles_${i}m (token, candle_start DESC);
      `);

      await client.query(`SELECT add_continuous_aggregate_policy('candles_${i}m',
      start_offset => INTERVAL '1 day',
      end_offset => INTERVAL '${i} minutes',
      schedule_interval => INTERVAL '${i} minutes');`);

      console.log(`Created candles_${i}m view and index`);
    }         

    console.log('✅ TimescaleDB setup completed successfully!');

  } catch (err) {
    console.error("❌ Error setting up TimescaleDB:", err);
  } finally {
    await client.end();
  }
}

setupTimescale();