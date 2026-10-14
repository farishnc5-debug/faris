package com.linguastep.app.data.seed

/** A single 2-minute micro-lesson module. */
data class DailyLesson(
    val day: Int,
    val targetWords: List<String>,
    val fillBlankSentence: String,
    val fillBlankAnswer: String,
    val fillBlankOptions: List<String>,
    val sentenceBuildingWords: List<String>,
    val sentenceBuildingAnswer: String
)

object DailyLessonSeed {

    fun lessons(): List<DailyLesson> = listOf(
        DailyLesson(
            day = 1,
            targetWords = listOf("GO", "IN", "SUN"),
            fillBlankSentence = "The ___ is shining brightly today.",
            fillBlankAnswer = "SUN",
            fillBlankOptions = listOf("SUN", "CAT", "RUN"),
            sentenceBuildingWords = listOf("I", "GO", "IN"),
            sentenceBuildingAnswer = "I GO IN"
        ),
        DailyLesson(
            day = 2,
            targetWords = listOf("HAPPY", "SMILE", "WATER"),
            fillBlankSentence = "Drinking ___ keeps you healthy.",
            fillBlankAnswer = "WATER",
            fillBlankOptions = listOf("WATER", "LIGHT", "BREAD"),
            sentenceBuildingWords = listOf("SHE", "IS", "HAPPY"),
            sentenceBuildingAnswer = "SHE IS HAPPY"
        ),
        DailyLesson(
            day = 3,
            targetWords = listOf("GARDEN", "JOURNEY", "MARKET"),
            fillBlankSentence = "We took a long ___ across the country.",
            fillBlankAnswer = "JOURNEY",
            fillBlankOptions = listOf("JOURNEY", "GARDEN", "MIRROR"),
            sentenceBuildingWords = listOf("THE", "GARDEN", "IS", "GREEN"),
            sentenceBuildingAnswer = "THE GARDEN IS GREEN"
        ),
        DailyLesson(
            day = 4,
            targetWords = listOf("PERSPECTIVE", "SIGNIFICANT", "DEVELOPMENT"),
            fillBlankSentence = "Her new job was a ___ change in perspective.",
            fillBlankAnswer = "SIGNIFICANT",
            fillBlankOptions = listOf("SIGNIFICANT", "PHENOMENON", "CONSEQUENCE"),
            sentenceBuildingWords = listOf("THIS", "IS", "A", "SIGNIFICANT", "DEVELOPMENT"),
            sentenceBuildingAnswer = "THIS IS A SIGNIFICANT DEVELOPMENT"
        )
    )

    fun lessonForDayIndex(index: Int): DailyLesson {
        val list = lessons()
        return list[index % list.size]
    }
}
