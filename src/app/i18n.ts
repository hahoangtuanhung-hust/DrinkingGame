import type { Language } from "./settingsStore";
import type { CardRule, Suit } from "../features/cards/types";

export const copy = {
  en: {
    shell: { dice: "Dice Shaker", rules: "Rule Studio", cards: "Card Table", tableGames: "TABLE GAMES", loading: "Setting the table…" },
    home: {
      eyebrow: "Two games. Zero setup.", titleLead: "Bring the", titleAccent: "table", titleEnd: "to life.",
      intro: "Tactile party classics built for the screen in your hand. Pick a game and pass it around.", choose: "Choose a game",
      diceKicker: "Tactile 3D", diceTitle: "Dice Shaker", diceDescription: "Shake five dice, lift the lid to peek, and reveal what’s waiting underneath.", diceAction: "Shake the dice",
      cardsKicker: "52 unique cards", cardsTitle: "Card Table", cardsDescription: "Draw, flip, and follow the prompt. Customize every rule to make the deck yours.", cardsAction: "Deal me in",
      saved: "Progress saves automatically on this device",
    },
    cards: {
      eyebrow: "The card table", title: "Draw your fate.", subtitle: "One card, one prompt, no repeats.", editRules: "Edit rules", reset: "Reset",
      drawPile: "Draw pile", swipe: "Swipe the top card", completed: "Deck completed", revealing: "Revealing…", draw: "Draw a card",
      current: "Current card", drawNumber: (order: number) => `Draw #${order}`, backLatest: "Back to latest",
      passNote: "Non-alcoholic drinks and passes always count.", firstTitle: "Your first card is waiting.", firstBody: "Draw from the deck to reveal a card and its rule.",
      history: "Draw history", historyTitle: (count: number) => count ? `${count} card${count === 1 ? "" : "s"} on the table` : "Nothing drawn yet", historyEmpty: "Drawn cards will collect here in order.",
      resetTitle: "Shuffle a new deck?", resetEyebrow: "Reset card table", resetBody: (count: number) => `This clears all ${count} drawn cards. Your custom rules stay safely saved.`, keepPlaying: "Keep playing", shuffleReset: "Shuffle & reset",
      cardsLeft: "cards left", deckLabel: (remaining: number) => `${remaining} cards remaining. Swipe or activate to draw.`, faceDown: "Face-down playing card",
    },
    rules: {
      back: "Back to the table", eyebrow: "Rule studio", title: "Make it yours.", subtitle: "Edit any card. Changes are saved on this device.", restore: "Restore defaults",
      searchPlaceholder: "Find a card or rule", searchLabel: "Search rules", filterLabel: "Filter cards by suit", all: "All", cards: "cards", fullDeck: "Full deck",
      showSuit: (suit: string) => `Show ${suit}`, cardLabel: (rank: string, suit: string) => `${rank} of ${suit}`,
      editing: "Editing exact-card rule", ruleTitle: "Rule title", instructions: "Instructions", category: "Category", saved: "Saved", save: "Save this rule",
      note: "Rules are plain text only and validated before saving. Past draws retain the rule shown at the time.",
      restoreTitle: "Restore every rule?", restoreBody: "All 52 custom rules will return to the friendly house defaults. Past draw history will not change.", cancel: "Cancel",
    },
  },
  vi: {
    shell: { dice: "Bộ lắc xúc xắc", rules: "Trình sửa luật", cards: "Bàn chơi bài", tableGames: "TRÒ CHƠI BÀN", loading: "Đang chuẩn bị bàn chơi…" },
    home: {
      eyebrow: "Hai trò chơi. Không cần chuẩn bị.", titleLead: "Khuấy động", titleAccent: "bàn chơi", titleEnd: "ngay thôi.",
      intro: "Những trò chơi tiệc tùng quen thuộc, sống động ngay trên điện thoại. Chọn một trò rồi chuyền máy cho nhau.", choose: "Chọn trò chơi",
      diceKicker: "3D sống động", diceTitle: "Bộ lắc xúc xắc", diceDescription: "Lắc năm viên xúc xắc, mở nắp và xem điều gì đang chờ bên dưới.", diceAction: "Lắc xúc xắc",
      cardsKicker: "52 lá bài độc đáo", cardsTitle: "Bàn chơi bài", cardsDescription: "Rút bài, lật bài và làm theo thử thách. Tùy chỉnh từng luật để tạo bộ bài của riêng bạn.", cardsAction: "Bắt đầu chia bài",
      saved: "Tiến trình được tự động lưu trên thiết bị này",
    },
    cards: {
      eyebrow: "Bàn chơi bài", title: "Rút lá bài định mệnh.", subtitle: "Mỗi lá một thử thách, không lặp lại.", editRules: "Sửa luật", reset: "Đặt lại",
      drawPile: "Chồng bài rút", swipe: "Vuốt lá trên cùng", completed: "Đã rút hết bộ bài", revealing: "Đang lật…", draw: "Rút một lá",
      current: "Lá bài hiện tại", drawNumber: (order: number) => `Lượt rút #${order}`, backLatest: "Về lá mới nhất",
      passNote: "Đồ uống không cồn và bỏ lượt luôn được chấp nhận.", firstTitle: "Lá bài đầu tiên đang chờ bạn.", firstBody: "Rút từ bộ bài để xem lá bài và luật tương ứng.",
      history: "Lịch sử rút bài", historyTitle: (count: number) => count ? `${count} lá bài trên bàn` : "Chưa rút lá nào", historyEmpty: "Các lá đã rút sẽ được xếp theo thứ tự tại đây.",
      resetTitle: "Xáo một bộ bài mới?", resetEyebrow: "Đặt lại bàn bài", resetBody: (count: number) => `Thao tác này xóa ${count} lá đã rút. Các luật tùy chỉnh của bạn vẫn được lưu.`, keepPlaying: "Chơi tiếp", shuffleReset: "Xáo và đặt lại",
      cardsLeft: "lá còn lại", deckLabel: (remaining: number) => `Còn ${remaining} lá. Vuốt hoặc nhấn để rút.`, faceDown: "Lá bài đang úp",
    },
    rules: {
      back: "Quay lại bàn bài", eyebrow: "Trình sửa luật", title: "Tạo luật của bạn.", subtitle: "Sửa bất kỳ lá bài nào. Thay đổi được lưu trên thiết bị này.", restore: "Khôi phục mặc định",
      searchPlaceholder: "Tìm lá bài hoặc luật", searchLabel: "Tìm luật", filterLabel: "Lọc bài theo chất", all: "Tất cả", cards: "lá", fullDeck: "Cả bộ bài",
      showSuit: (suit: string) => `Hiện chất ${suit}`, cardLabel: (rank: string, suit: string) => `${rank} ${suit}`,
      editing: "Đang sửa luật riêng của lá", ruleTitle: "Tên luật", instructions: "Hướng dẫn", category: "Thể loại", saved: "Đã lưu", save: "Lưu luật này",
      note: "Luật chỉ gồm văn bản và được kiểm tra trước khi lưu. Các lượt rút trước vẫn giữ nguyên luật tại thời điểm đó.",
      restoreTitle: "Khôi phục toàn bộ luật?", restoreBody: "Cả 52 luật tùy chỉnh sẽ trở về luật mặc định thân thiện. Lịch sử rút bài không thay đổi.", cancel: "Hủy",
    },
  },
} as const;

export const getCopy = (language: Language) => copy[language];

export const suitLabels: Record<Language, Record<Suit, string>> = {
  en: { hearts: "hearts", diamonds: "diamonds", clubs: "clubs", spades: "spades" },
  vi: { hearts: "cơ", diamonds: "rô", clubs: "chuồn", spades: "bích" },
};

export const categoryLabels: Record<Language, Record<CardRule["category"], string>> = {
  en: { social: "Social", story: "Story", challenge: "Challenge", choice: "Choice", wild: "Wild" },
  vi: { social: "Giao lưu", story: "Chia sẻ", challenge: "Thử thách", choice: "Lựa chọn", wild: "Tự do" },
};
