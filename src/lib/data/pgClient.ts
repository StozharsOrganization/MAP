import { Pool } from 'pg';

let pool: Pool | null = null;
let lastCheckTime = 0;
let lastCheckResult = false;

export function getPgPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 1500,
      idleTimeoutMillis: 5000,
      max: 5,
    });

    pool.on('error', (err) => {
      // Prevent unhandled error event on the pool instance
      lastCheckResult = false;
    });
  }

  return pool;
}

export async function isPgConnected(): Promise<boolean> {
  const now = Date.now();
  // Cache connection check for 10 seconds to avoid spamming connection attempts
  if (now - lastCheckTime < 10000) {
    return lastCheckResult;
  }
  lastCheckTime = now;

  const p = getPgPool();
  if (!p) {
    lastCheckResult = false;
    return false;
  }

  let client: any = null;
  try {
    client = await p.connect();
    await client.query('SELECT 1');
    lastCheckResult = true;
    return true;
  } catch (err) {
    lastCheckResult = false;
    return false;
  } finally {
    if (client) {
      try {
        client.release();
      } catch {
        // Ignore release errors
      }
    }
  }
}
