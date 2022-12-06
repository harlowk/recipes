import { operations } from "./client";



(async () => {
  console.log("starting backend seed");
  await operations.waitForTable();
  await operations.clearTable();
  await operations.seedTable();
})()