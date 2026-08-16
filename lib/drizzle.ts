import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import * as schema from '@/schema';
import Chalk from '@/lib/chalk';


class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}


// OLD drizzle
// class Drizzle {
//   private static instance: Drizzle;
//   private client: Pool;
//   public db: ReturnType<typeof drizzle>;

//   private constructor() {

//     Chalk.call("[Drizzle] - init a pool")
//     this.client = new Pool({
//       connectionString: String(process.env.DATABASE_URL),
//       // ssl: {
//       //   rejectUnauthorized: false,
//       // },
//       ssl: false,
//       max: 10,
//       connectionTimeoutMillis: 5000,
//       idleTimeoutMillis: 5000,
//       application_name: 'overplanner',
//     });

//     this.client.on('remove', (client) => {
//       console.log({
//         message: "Drizzle. Connection removed",
//         totalCount: this.client.totalCount,
//         connections: this.client.idleCount,
//         waitingCount: this.client.waitingCount
//       })
//     });

//     this.db = drizzle(this.client, { schema });
//   }

//   // /**
//   //  * OPTIMIZED FOR SERVERLESS
//   //  * @returns 
//   //  */
//   // public static async getInstance(): Promise<Drizzle> {
//   //   const inst = new Drizzle();
//   //   await inst.connect();
//   //   return inst;
//   // }


export class Drizzle {
  private static instance: Drizzle | null = null;
  private static initializing: Promise<Drizzle> | null = null;

  private readonly pool: Pool;
  public readonly db: NodePgDatabase;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    this.db = drizzle(this.pool);
  }

  public static async getInstance(): Promise<Drizzle> {
    if (this.instance) {
      return this.instance;
    }

    if (this.initializing) {
      return this.initializing;
    }

    this.initializing = (async () => {
      const instance = new Drizzle();

      try {
        await instance.connect();

        this.instance = instance;
        return instance;
      } finally {
        this.initializing = null;
      }
    })();

    return this.initializing;
  }

  private async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();

      try {
        await client.query("SELECT 1");
      } finally {
        client.release();
      }
    } catch (error) {
      Chalk.fail("Drizzle.connect");
      console.error(error);

      throw new Error(
        "Unable to establish a connection to the PostgreSQL database."
      );
    }
  }
}

export default Drizzle;
