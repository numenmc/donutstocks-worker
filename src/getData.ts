import { TrackedItem } from "./tracked";
import { RawSnapshot } from "./dbType";
import { getAuctionData } from "./bot";

export async function getData(item: TrackedItem): Promise<RawSnapshot> {
  let d = await getAuctionData(item);
  if (!d) throw new Error("No data returned from getAuctionData");

  // Filter
  const itemIdFromMcId = item.mcId.split(":")[1];
  d = d.filter((a) => a.itemType == itemIdFromMcId && a.count >= item.maxStack);
  if (d.length === 0) throw new Error("No matching items found in auction data");

  // Find lowest price
  const lowest = d.reduce((min, a) => (a.price < min ? a.price : min), d[0].price);

  return {
    item_id: item.id,
    date: Date.now(),
    price: lowest
  };
}
