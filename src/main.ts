// Worker entry point
// This is !! NOT !! a part of the nextjs application

import nodeCron from "node-cron";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { trackedItems } from "./tracked";
import { getData } from "./getData";
import { log } from "./workerUtil";
import { initBot } from "./bot";

dotenv.config({ quiet: true, path: ".env" });

// --
initBot();

const db = mysql.createPool({
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT as string),
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_NAME as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS snapshots (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            item_id VARCHAR(255) NOT NULL,
            date BIGINT NOT NULL,
            price INT NOT NULL,
            INDEX(item_id, date)
        )
    `);
})();

async function run() {
    for (const item of trackedItems) {
        try {
            const snapshot = await getData(item);

            if (snapshot == null) {
                log(`No valid data for ${item.symbol}`);
                continue;
            }

            await db.execute("INSERT INTO snapshots (item_id, date, price) VALUES (?, ?, ?)", [snapshot.item_id, snapshot.date, snapshot.price]);
        } catch (err) {
            log(`Error processing ${item.symbol}:`, err);
        }
    }
}

nodeCron.schedule("* * * * *", () => {
  run();
  setTimeout(run, 30 * 1000);
});

log("Started, cron scheduled");
