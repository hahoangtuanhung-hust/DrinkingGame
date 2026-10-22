import { beforeEach, describe, expect, it } from "vitest";
import { useDiceStore } from "../features/dice/store/diceStore";

describe("dice peek interaction", () => {
  beforeEach(() => {
    useDiceStore.setState({
      phase: "READY",
      values: [1, 2, 3, 4, 5],
      hasResult: false,
      peekAmount: 0,
      shakeCount: 0,
    });
  });

  it("closes the lid after releasing a full peek before the first roll", () => {
    const store = useDiceStore.getState();
    store.setPeek(1);
    expect(useDiceStore.getState()).toMatchObject({ phase: "PEEKING", peekAmount: 1 });

    useDiceStore.getState().releasePeek();

    expect(useDiceStore.getState()).toMatchObject({ phase: "READY", peekAmount: 0 });
  });

  it("returns to the concealed result after releasing a full peek", () => {
    useDiceStore.setState({ phase: "CLOSED_RESULT", hasResult: true, peekAmount: 0 });
    useDiceStore.getState().setPeek(1);
    expect(useDiceStore.getState()).toMatchObject({ phase: "PEEKING", peekAmount: 1 });

    useDiceStore.getState().releasePeek();

    expect(useDiceStore.getState()).toMatchObject({ phase: "CLOSED_RESULT", peekAmount: 0 });
  });

  it("opens fully only through the explicit open action", () => {
    useDiceStore.setState({ phase: "CLOSED_RESULT", hasResult: true, peekAmount: 0 });
    useDiceStore.getState().setPeek(0.9);
    useDiceStore.getState().releasePeek();
    expect(useDiceStore.getState().phase).toBe("CLOSED_RESULT");

    useDiceStore.getState().open();

    expect(useDiceStore.getState()).toMatchObject({ phase: "OPEN", peekAmount: 1 });
  });
});
