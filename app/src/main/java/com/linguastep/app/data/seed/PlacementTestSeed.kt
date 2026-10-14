package com.linguastep.app.data.seed

enum class PlacementSection { LISTENING, VOCAB_MATCH, READING }

data class PlacementQuestion(
    val section: PlacementSection,
    val prompt: String,
    val audioWord: String? = null,
    val options: List<String>,
    val correctAnswer: String
)

object PlacementTestSeed {

    fun questions(): List<PlacementQuestion> = listOf(
        PlacementQuestion(
            section = PlacementSection.LISTENING,
            prompt = "Listen and choose the word you hear.",
            audioWord = "CAT",
            options = listOf("CAT", "CAP", "CAR"),
            correctAnswer = "CAT"
        ),
        PlacementQuestion(
            section = PlacementSection.LISTENING,
            prompt = "Listen and choose the word you hear.",
            audioWord = "JOURNEY",
            options = listOf("JOURNEY", "JOURNAL", "JOINED"),
            correctAnswer = "JOURNEY"
        ),
        PlacementQuestion(
            section = PlacementSection.VOCAB_MATCH,
            prompt = "Which word means \"a building where people live\"?",
            options = listOf("HOUSE", "MARKET", "MIRROR"),
            correctAnswer = "HOUSE"
        ),
        PlacementQuestion(
            section = PlacementSection.VOCAB_MATCH,
            prompt = "Which word means \"a remarkable fact or occurrence\"?",
            options = listOf("PHENOMENON", "CONSEQUENCE", "PERSPECTIVE"),
            correctAnswer = "PHENOMENON"
        ),
        PlacementQuestion(
            section = PlacementSection.READING,
            prompt = "\"Maria took a long journey to visit her grandmother in the countryside.\" Where did Maria go?",
            options = listOf("To visit her grandmother", "To a market", "To work"),
            correctAnswer = "To visit her grandmother"
        ),
        PlacementQuestion(
            section = PlacementSection.READING,
            prompt = "\"The significant development in her career came after years of hard work.\" What caused the development?",
            options = listOf("Years of hard work", "A short journey", "A garden"),
            correctAnswer = "Years of hard work"
        )
    )

    /** Maps a raw score fraction (0.0-1.0) to a CEFR tier. */
    fun tierForScore(correct: Int, total: Int): String {
        val fraction = if (total == 0) 0.0 else correct.toDouble() / total
        return when {
            fraction < 0.35 -> "A1"
            fraction < 0.6 -> "A2"
            fraction < 0.85 -> "B1"
            else -> "B2"
        }
    }

    /** Maps a CEFR tier to the vocabulary level tier it should start at. */
    fun startingVocabTier(cefr: String): Int = when (cefr) {
        "A1" -> 1
        "A2" -> 2
        "B1" -> 3
        else -> 4
    }
}
