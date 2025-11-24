/*
* For the guys coming from YouTube:
*   This is copied from my web app too, so there might be some
*   unused classes or interfaces.
*/

/**
 * A snapshot is a representation of the lowest price of an item at a specific point in time.
 */
export class Snapshot {
  private date: Date;
  private price: number;
  private item_id: string;

  constructor(date: Date, price: number, item_id: string) {
    this.date = date;
    this.price = price;
    this.item_id = item_id;
  }

  /**
   * Get the date of the snapshot.
   * @returns The date of the snapshot.
   */
  public getDate(): Date {
    return this.date;
  }

  /**
   * Get the price of the item at the time of the snapshot.
   * @returns The price of the item at the time of the snapshot.
   */
  public getPrice(): number {
    return this.price;
  }

  /**
   * Get the ID of the item associated with the snapshot.
   * @returns The item ID.
   */
  public getItemId(): string {
    return this.item_id;
  }

  /**
   * Creates a Snapshot instance from raw database values.
   * @param raw The raw snapshot data from the database.
   * @returns A Snapshot instance created from the data provided.
   */
  public static of(raw: RawSnapshot): Snapshot {
    return new Snapshot(new Date(raw.date), raw.price, raw.item_id);
  }
}

/**
 * Interface representing the raw values of {@link Snapshot} from the database.
 */
export interface RawSnapshot {
  date: number;
  price: number;
  item_id: string;
}

/**
 * Interface representing a period of time with associated price data.
 */
export interface Period {
  start: Date;
  end: Date;

  open: number;
  close: number;
  high: number;
  low: number;
}

/**
 * Interface representing the raw values of {@link Period} from the database.
 */
export interface RawPeriod {
  start: number;
  end: number;

  open: number;
  close: number;
  high: number;
  low: number;
}

/**
 * Enumeration representing the type of price movement over a period.
 */
export enum PeriodType {
  DOWN,
  UP,
  EQUAL
}
