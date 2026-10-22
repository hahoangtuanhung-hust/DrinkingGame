import type { CardRule, PlayingCard, Rank, Suit } from "../types";
import type { Language } from "../../../app/settingsStore";

export const rankRules: Record<Rank, CardRule> = {
  A: { id: "rank-A", title: "Make a toast", description: "Raise a glass and make a short toast. Any drink counts.", category: "social" },
  "2": { id: "rank-2", title: "Choose a player", description: "Choose someone to take one small sip or a snack bite.", category: "choice" },
  "3": { id: "rank-3", title: "Three-word story", description: "Add exactly three words to the group's ongoing story.", category: "story" },
  "4": { id: "rank-4", title: "Floor", description: "Last player to touch the floor takes a small sip.", category: "challenge" },
  "5": { id: "rank-5", title: "High five", description: "Start a high-five chain. The last pair drinks water.", category: "social" },
  "6": { id: "rank-6", title: "Quick category", description: "Name items in a category. First repeat or pause takes one sip.", category: "challenge" },
  "7": { id: "rank-7", title: "Sky", description: "Last player to point upward takes one small sip.", category: "challenge" },
  "8": { id: "rank-8", title: "Mate", description: "Pick a partner. Your next optional sip may be shared.", category: "choice" },
  "9": { id: "rank-9", title: "Rhyme time", description: "Go around with rhyming words. First miss takes one sip.", category: "challenge" },
  "10": { id: "rank-10", title: "Question master", description: "Ask a player a question. If they answer, they take one sip.", category: "challenge" },
  J: { id: "rank-J", title: "Never have I ever", description: "Share a lighthearted 'never have I ever'. Keep it respectful.", category: "story" },
  Q: { id: "rank-Q", title: "Table question", description: "Ask the table a fun question; everyone gets a turn to answer.", category: "story" },
  K: { id: "rank-K", title: "House rule", description: "Create a harmless rule that lasts until the next King appears.", category: "wild" },
};

export const rankRulesVi: Record<Rank, CardRule> = {
  A: { id: "rank-A", title: "Nâng ly", description: "Cùng nâng ly và nói một lời chúc ngắn. Mọi loại đồ uống đều được tính.", category: "social" },
  "2": { id: "rank-2", title: "Chọn một người", description: "Chọn một người uống một ngụm nhỏ hoặc ăn một miếng đồ ăn nhẹ.", category: "choice" },
  "3": { id: "rank-3", title: "Chuyện ba từ", description: "Thêm đúng ba từ vào câu chuyện chung của cả nhóm.", category: "story" },
  "4": { id: "rank-4", title: "Chạm sàn", description: "Người cuối cùng chạm tay xuống sàn uống một ngụm nhỏ.", category: "challenge" },
  "5": { id: "rank-5", title: "Đập tay", description: "Bắt đầu chuỗi đập tay. Cặp cuối cùng uống nước.", category: "social" },
  "6": { id: "rank-6", title: "Kể tên nhanh", description: "Lần lượt kể tên theo một chủ đề. Người đầu tiên lặp lại hoặc ngập ngừng uống một ngụm.", category: "challenge" },
  "7": { id: "rank-7", title: "Chỉ lên trời", description: "Người cuối cùng chỉ tay lên trên uống một ngụm nhỏ.", category: "challenge" },
  "8": { id: "rank-8", title: "Đồng đội", description: "Chọn một người đồng hành. Lượt uống tùy chọn tiếp theo có thể chia sẻ cùng nhau.", category: "choice" },
  "9": { id: "rank-9", title: "Vần nối vần", description: "Lần lượt nói các từ có vần. Người đầu tiên nói sai uống một ngụm.", category: "challenge" },
  "10": { id: "rank-10", title: "Bậc thầy câu hỏi", description: "Hỏi một người chơi một câu. Nếu họ trả lời, họ uống một ngụm.", category: "challenge" },
  J: { id: "rank-J", title: "Tôi chưa từng", description: "Chia sẻ một điều vui vẻ theo kiểu ‘Tôi chưa từng’. Hãy luôn tôn trọng nhau.", category: "story" },
  Q: { id: "rank-Q", title: "Câu hỏi quanh bàn", description: "Đặt một câu hỏi vui; mọi người đều có lượt trả lời.", category: "story" },
  K: { id: "rank-K", title: "Luật bàn chơi", description: "Tạo một luật vô hại kéo dài cho đến khi lá K tiếp theo xuất hiện.", category: "wild" },
};

export const localizeRule = (card: PlayingCard, rule: CardRule, language: Language): CardRule => {
  if (language === "en") return rule;
  const original = rankRules[card.rank];
  const isUneditedDefault = rule.title === original.title && rule.description === original.description && rule.category === original.category;
  return isUneditedDefault ? { ...rule, title: rankRulesVi[card.rank].title, description: rankRulesVi[card.rank].description } : rule;
};

export const suitRules: Record<Suit, CardRule> = {
  hearts: { id: "suit-hearts", title: "Share the love", description: "Give someone at the table a genuine compliment.", category: "social" },
  diamonds: { id: "suit-diamonds", title: "Little luxury", description: "Name one small thing that made your week better.", category: "story" },
  clubs: { id: "suit-clubs", title: "Team choice", description: "The group chooses a quick, safe mini-challenge.", category: "challenge" },
  spades: { id: "suit-spades", title: "Switch it up", description: "Choose another player to swap seats with you.", category: "choice" },
};

export const defaultRule: CardRule = {
  id: "default",
  title: "Your choice",
  description: "Take one small sip, choose a non-alcoholic alternative, or pass.",
  category: "choice",
};

export const makeDefaultExactRules = (cards: readonly PlayingCard[]): Record<string, CardRule> =>
  Object.fromEntries(cards.map((card) => [card.id, { ...rankRules[card.rank], id: `exact-${card.id}` }]));

export const resolveRule = (
  card: PlayingCard,
  exactRules: Record<string, CardRule | undefined>,
  ranks: Partial<Record<Rank, CardRule>> = rankRules,
  suits: Partial<Record<Suit, CardRule>> = suitRules,
): CardRule => exactRules[card.id] ?? ranks[card.rank] ?? suits[card.suit] ?? defaultRule;
