package com.linguastep.app.data.db.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/** Singleton row (id is always 1) holding the learner's overall state. */
@Entity(tableName = "user_progress")
data class UserProgress(
    @PrimaryKey val id: Int = 1,
    val proficiencyLevel: String = "A1",
    val totalXp: Int = 0,
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val lastActiveDate: String = "",
    val reminderHour: Int = 19,
    val reminderMinute: Int = 0,
    val notificationsEnabled: Boolean = false,
    val placementTestCompleted: Boolean = false,
    val quizzesTaken: Int = 0,
    val quizzesCorrect: Int = 0
)
