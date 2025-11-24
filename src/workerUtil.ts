export const log = (...args: unknown[]) => {
  console.log(`[Worker Thread ${new Date().toISOString()}]`, ...args);
}

export const parseAbbreviatedNumber = (str: string): number => {
    const multiplier: { [key: string]: number } = {
        K: 1_000,
        M: 1_000_000,
        B: 1_000_000_000
    }

    // Split into number and suffix components
    const match = str.match(/^([\d,.]+)([KMB])?$/);
    if (!match) {
        throw new Error(`Invalid abbreviated number format: ${str}`);
    }

    const numberPart = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2];

    if (suffix && multiplier[suffix]) {
        return numberPart * multiplier[suffix];
    } else {
        return numberPart;
    }
}
