package com.linguastep.app.data.db.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * levelTier: 1 = 2-3 letters, 2 = 4-5 letters, 3 = 6-7 letters, 4 = 8+ letters
 * masteryStage: 0 = Unlocked, 1 = Stage 1 passed, 2 = Stage 2 passed, 3 = Mastered
 */
@Entity(tableName = "word_mastery")
data class WordMastery(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val word: String,
    val phonetic: String,
    val definition: String,
    val levelTier: Int,
    val syllables: Int,
    val masteryStage: Int = 0,
    val lastPracticed: Long = 0L
)
