export type RandomInt = (maxExclusive: number) => number;

/** Secure rejection sampling avoids the modulo bias of Math.random-based helpers. */
export const secureRandomInt: RandomInt = (maxExclusive) => {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError("maxExclusive must be a positive safe integer");
  }
  const maximum = 0x1_0000_0000;
  const limit = maximum - (maximum % maxExclusive);
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % maxExclusive;
};

export const fisherYates = <T>(items: readonly T[], randomInt: RandomInt = secureRandomInt): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
