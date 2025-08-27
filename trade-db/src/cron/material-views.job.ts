import cron from "node-cron";
import { db } from "../index.js";

export const startCronJobs = () => {
  // Run every minute
  cron.schedule("* * * * *", async() => {
    await db.refresh("1m").catch((err) => console.error(err));
  });

  cron.schedule("*/5 * * * *", async() => {
    await db.refresh("5m").catch((err) => console.error(err));
  });

  cron.schedule("*/10 * * * *", async() => {
    await db.refresh("5m").catch((err) => console.error(err));
  });

  cron.schedule("*/15 * * * *", async() => {
    await db.refresh("5m").catch((err) => console.error(err));
  });

  cron.schedule("*/30 * * * *", async() => {
    await db.refresh("5m").catch((err) => console.error(err));
  });


  console.log("Cron jobs started...");
};
