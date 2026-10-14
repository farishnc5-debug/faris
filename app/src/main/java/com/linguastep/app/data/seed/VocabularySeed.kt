package com.linguastep.app.data.seed

import com.linguastep.app.data.db.entity.WordMastery

/**
 * Curated vocabulary progression by word length / syllable complexity.
 * Tier 1: 2-3 letters, Tier 2: 4-5 letters, Tier 3: 6-7 letters, Tier 4: 8+ letters.
 */
object VocabularySeed {

    fun words(): List<WordMastery> = tier1 + tier2 + tier3 + tier4

    private val tier1 = listOf(
        entry("GO", "goh", "To move from one place to another.", 1, 1),
        entry("IN", "in", "Inside a place or thing.", 1, 1),
        entry("CAT", "kat", "A small furry pet that meows.", 1, 1),
        entry("SUN", "suhn", "The star that lights our day.", 1, 1),
        entry("DOG", "dawg", "A loyal furry pet that barks.", 1, 1),
        entry("RUN", "ruhn", "To move quickly on your feet.", 1, 1),
        entry("BIG", "big", "Large in size.", 1, 1),
        entry("RED", "red", "A warm, bright color.", 1, 1),
        entry("YES", "yes", "A word of agreement.", 1, 1),
        entry("TOP", "top", "The highest point of something.", 1, 1)
    )

    private val tier2 = listOf(
        entry("HAPPY", "HAP-ee", "Feeling joy or pleasure.", 2, 2),
        entry("TABLE", "TAY-buhl", "A flat surface with legs used for meals or work.", 2, 2),
        entry("HOUSE", "hows", "A building where people live.", 2, 1),
        entry("WATER", "WAW-ter", "A clear liquid everyone needs to drink.", 2, 2),
        entry("QUICK", "kwik", "Moving fast.", 2, 1),
        entry("SMILE", "smyl", "An expression of happiness on the face.", 2, 1),
        entry("GREEN", "green", "The color of grass and leaves.", 2, 1),
        entry("LIGHT", "lyt", "Brightness that lets you see.", 2, 1),
        entry("MUSIC", "MYOO-zik", "Sounds arranged in a pleasing way.", 2, 2),
        entry("BREAD", "bred", "A baked food made from flour.", 2, 1)
    )

    private val tier3 = listOf(
        entry("GARDEN", "GAR-dn", "A piece of land for growing plants.", 3, 2),
        entry("CULTURE", "KUHL-cher", "The customs and ideas of a group of people.", 3, 2),
        entry("JOURNEY", "JUR-nee", "A trip from one place to another.", 3, 2),
        entry("FREEDOM", "FREE-duhm", "The power to act or speak as you wish.", 3, 2),
        entry("KITCHEN", "KICH-uhn", "The room where food is prepared.", 3, 2),
        entry("PICTURE", "PIK-cher", "An image or photo.", 3, 2),
        entry("MIRROR", "MEER-er", "A glass surface that reflects your image.", 3, 2),
        entry("SUMMER", "SUHM-er", "The warmest season of the year.", 3, 2),
        entry("WINTER", "WIN-ter", "The coldest season of the year.", 3, 2),
        entry("MARKET", "MAR-kit", "A place where goods are bought and sold.", 3, 2)
    )

    private val tier4 = listOf(
        entry("PHENOMENON", "fih-NOM-uh-non", "A remarkable fact or occurrence.", 4, 5),
        entry("PERSPECTIVE", "per-SPEK-tiv", "A particular way of viewing things.", 4, 3),
        entry("KNOWLEDGE", "NOL-ij", "Facts and skills gained through experience.", 4, 2),
        entry("ENVIRONMENT", "en-VY-run-ment", "The natural world around us.", 4, 4),
        entry("OPPORTUNITY", "op-er-TOO-nih-tee", "A chance for progress or advancement.", 4, 5),
        entry("CONSEQUENCE", "KON-sih-kwens", "A result or effect of an action.", 4, 3),
        entry("SIGNIFICANT", "sig-NIF-ih-kant", "Important enough to be worth noting.", 4, 4),
        entry("DEVELOPMENT", "dih-VEL-up-ment", "The process of growing or improving.", 4, 4),
        entry("UNDERSTAND", "un-der-STAND", "To grasp the meaning of something.", 4, 3),
        entry("PRONUNCIATION", "pruh-nun-see-AY-shun", "The way a word is spoken.", 4, 5)
    )

    private fun entry(word: String, phonetic: String, definition: String, tier: Int, syllables: Int) =
        WordMastery(word = word, phonetic = phonetic, definition = definition, levelTier = tier, syllables = syllables)
}
