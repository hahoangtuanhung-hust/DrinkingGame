export const DICE_SHAKE_TOTAL_MS = 2_000;
export const DICE_SHAKE_SETTLE_MS = 320;
export const DICE_SHAKE_ACTIVE_MS = DICE_SHAKE_TOTAL_MS - DICE_SHAKE_SETTLE_MS;

export const DICE_REDUCED_SHAKE_ACTIVE_MS = 100;
export const DICE_REDUCED_SHAKE_SETTLE_MS = 100;

export const getDiceShakeTimeline = (reducedMotion: boolean) => reducedMotion
  ? { activeMs: DICE_REDUCED_SHAKE_ACTIVE_MS, settleMs: DICE_REDUCED_SHAKE_SETTLE_MS }
  : { activeMs: DICE_SHAKE_ACTIVE_MS, settleMs: DICE_SHAKE_SETTLE_MS };
