import { describe, expect, it } from "vitest";
import { createDeck } from "../features/cards/engine/deckEngine";
import { defaultRule, localizeRule, rankRules, resolveRule } from "../features/cards/rules/rules";
import type { CardRule } from "../features/cards/types";

const rule = (id: string): CardRule => ({ id, title: id, description: `${id} description`, category: "choice" });

describe("rule resolution", () => {
  const card = createDeck().find((item) => item.id === "A-spades")!;
  it("prioritizes exact card rules", () => {
    expect(resolveRule(card, { [card.id]: rule("exact") }, { A: rule("rank") }, { spades: rule("suit") }).id).toBe("exact");
  });
  it("falls through rank, suit, then default", () => {
    expect(resolveRule(card, {}, { A: rule("rank") }, { spades: rule("suit") }).id).toBe("rank");
    expect(resolveRule(card, {}, {}, { spades: rule("suit") }).id).toBe("suit");
    expect(resolveRule(card, {}, {}, {}).id).toBe(defaultRule.id);
  });
  it("translates defaults without overwriting custom rules", () => {
    const defaultForCard = { ...rankRules.A, id: `exact-${card.id}` };
    expect(localizeRule(card, defaultForCard, "vi").title).toBe("Nâng ly");
    const custom = { ...defaultForCard, title: "Luật riêng của tôi" };
    expect(localizeRule(card, custom, "vi")).toBe(custom);
  });
});
