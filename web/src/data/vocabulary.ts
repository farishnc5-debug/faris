import type { WordMastery } from "../types";

/**
 * Curated vocabulary progression by word length / syllable complexity.
 * Tier 1: 2-3 letters, Tier 2: 4-5 letters, Tier 3: 6-7 letters, Tier 4: 8+ letters.
 */
function entry(
  id: number,
  word: string,
  phonetic: string,
  definition: string,
  levelTier: 1 | 2 | 3 | 4,
  syllables: number
): WordMastery {
  return { id, word, phonetic, definition, levelTier, syllables, masteryStage: 0, lastPracticed: 0 };
}

export const VOCABULARY_SEED: WordMastery[] = [
  entry(1, "GO", "goh", "To move from one place to another.", 1, 1),
  entry(2, "IN", "in", "Inside a place or thing.", 1, 1),
  entry(3, "CAT", "kat", "A small furry pet that meows.", 1, 1),
  entry(4, "SUN", "suhn", "The star that lights our day.", 1, 1),
  entry(5, "DOG", "dawg", "A loyal furry pet that barks.", 1, 1),
  entry(6, "RUN", "ruhn", "To move quickly on your feet.", 1, 1),
  entry(7, "BIG", "big", "Large in size.", 1, 1),
  entry(8, "RED", "red", "A warm, bright color.", 1, 1),
  entry(9, "YES", "yes", "A word of agreement.", 1, 1),
  entry(10, "TOP", "top", "The highest point of something.", 1, 1),

  entry(11, "HAPPY", "HAP-ee", "Feeling joy or pleasure.", 2, 2),
  entry(12, "TABLE", "TAY-buhl", "A flat surface with legs used for meals or work.", 2, 2),
  entry(13, "HOUSE", "hows", "A building where people live.", 2, 1),
  entry(14, "WATER", "WAW-ter", "A clear liquid everyone needs to drink.", 2, 2),
  entry(15, "QUICK", "kwik", "Moving fast.", 2, 1),
  entry(16, "SMILE", "smyl", "An expression of happiness on the face.", 2, 1),
  entry(17, "GREEN", "green", "The color of grass and leaves.", 2, 1),
  entry(18, "LIGHT", "lyt", "Brightness that lets you see.", 2, 1),
  entry(19, "MUSIC", "MYOO-zik", "Sounds arranged in a pleasing way.", 2, 2),
  entry(20, "BREAD", "bred", "A baked food made from flour.", 2, 1),

  entry(21, "GARDEN", "GAR-dn", "A piece of land for growing plants.", 3, 2),
  entry(22, "CULTURE", "KUHL-cher", "The customs and ideas of a group of people.", 3, 2),
  entry(23, "JOURNEY", "JUR-nee", "A trip from one place to another.", 3, 2),
  entry(24, "FREEDOM", "FREE-duhm", "The power to act or speak as you wish.", 3, 2),
  entry(25, "KITCHEN", "KICH-uhn", "The room where food is prepared.", 3, 2),
  entry(26, "PICTURE", "PIK-cher", "An image or photo.", 3, 2),
  entry(27, "MIRROR", "MEER-er", "A glass surface that reflects your image.", 3, 2),
  entry(28, "SUMMER", "SUHM-er", "The warmest season of the year.", 3, 2),
  entry(29, "WINTER", "WIN-ter", "The coldest season of the year.", 3, 2),
  entry(30, "MARKET", "MAR-kit", "A place where goods are bought and sold.", 3, 2),

  entry(31, "PHENOMENON", "fih-NOM-uh-non", "A remarkable fact or occurrence.", 4, 5),
  entry(32, "PERSPECTIVE", "per-SPEK-tiv", "A particular way of viewing things.", 4, 3),
  entry(33, "KNOWLEDGE", "NOL-ij", "Facts and skills gained through experience.", 4, 2),
  entry(34, "ENVIRONMENT", "en-VY-run-ment", "The natural world around us.", 4, 4),
  entry(35, "OPPORTUNITY", "op-er-TOO-nih-tee", "A chance for progress or advancement.", 4, 5),
  entry(36, "CONSEQUENCE", "KON-sih-kwens", "A result or effect of an action.", 4, 3),
  entry(37, "SIGNIFICANT", "sig-NIF-ih-kant", "Important enough to be worth noting.", 4, 4),
  entry(38, "DEVELOPMENT", "dih-VEL-up-ment", "The process of growing or improving.", 4, 4),
  entry(39, "UNDERSTAND", "un-der-STAND", "To grasp the meaning of something.", 4, 3),
  entry(40, "PRONUNCIATION", "pruh-nun-see-AY-shun", "The way a word is spoken.", 4, 5)
];
