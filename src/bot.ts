import mineflayer from "mineflayer";
import { log, parseAbbreviatedNumber } from "./workerUtil";
import { TrackedItem, trackedItems } from "./tracked";
import dotenv from "dotenv";
import { Item } from "prismarine-item";
import loader from "prismarine-chat";
import nbt from "prismarine-nbt";
const ChatMessage = loader("1.21.1");

dotenv.config({ quiet: true, path: ".env" });

export let WORKER_BOT: mineflayer.Bot = createBot();

function scheduleBotReconnect() {
  log("Bot disconnected");
  setTimeout(() => {
    WORKER_BOT = createBot();
  }, 1000);
}

export function initBot() {}

function getLore(item: Item): string[] | null {
  const a = (item as Item & { componentMap: any }).componentMap.get(
    "lore"
  )?.data;
  if (!a) return null;
  return (a as object[]).map((o) => {
    return new ChatMessage(nbt.simplify(o as any)).toString();
  });
}

function createBot() {
  const b = mineflayer.createBot({
    host: process.env.DONUT_IP!,
    port: parseInt(process.env.DONUT_PORT!),
    auth: "microsoft",
    username: process.env.MINECRAFT_USERNAME!
  });

  b.on("login", () => {
    log("Worker bot connected to server");
  });

  b.on("error", (err) => {
    log("Bot error:", err);
  });

  b.on("kicked", (reason, loggedIn) => {
    log("Bot was kicked from the server:", reason, "Logged in:", loggedIn);
  });

  b.on("end", () => {
    log("Bot connection ended");
    scheduleBotReconnect();
  });

  b.on("chat", (message) => {
    log("Bot chat message:", message);
  });

  return b;
}

export async function getAuctionData(item: TrackedItem) {
  // attempt to close current screen
  if (WORKER_BOT.currentWindow)
    WORKER_BOT.closeWindow(WORKER_BOT.currentWindow);

  // open auction house
  WORKER_BOT.chat(`/ah ${item.search}`);
  await WORKER_BOT.waitForTicks(20);

  const window = WORKER_BOT.currentWindow;
  if (!window) {
    log("No window opened after /ah");
    return;
  }

  const topContainerSize = window.inventoryStart; // first N slots are auction items
  const auctionItems = window.slots.slice(0, topContainerSize).slice(0, -9);

  const itemPrices = auctionItems
    .map((slot) => {
      if (!slot) return null;

      const lore = getLore(slot);
      if (!lore) return null;

      const sellerLine = lore.find((line) => line.startsWith("Seller: "));
      const priceLine = lore.find((line) => line.startsWith("Price: $"));
      if (!sellerLine || !priceLine) return null;

      const seller = sellerLine.replace("Seller: ", "").trim();
      const priceStr = priceLine
        .replace("Price: $", "")
        .trim()
        .replace(/,/g, "");

      return {
        seller,
        price: parseAbbreviatedNumber(priceStr),
        itemType: slot.name,
        count: slot.count,
      };
    })
    .filter((x) => x != null) as {
    seller: string;
    price: number;
    itemType: string;
    count: number;
  }[];

  return itemPrices;
}
