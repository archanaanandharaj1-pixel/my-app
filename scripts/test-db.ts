import * as dotenv from "dotenv";
import { sql } from "drizzle-orm";

dotenv.config({ path: ".env" });

async function main() {
    console.log("Testing DB connection...");
    // Dynamic import to ensure process.env is populated before db.ts is evaluated
    const { db } = await import("../lib/db");

    try {
        const result = await db.execute(sql`SELECT 1`);
        console.log("Connection successful!", result);
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
}

main();
