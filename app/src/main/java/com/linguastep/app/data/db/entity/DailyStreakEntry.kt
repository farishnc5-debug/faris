package com.linguastep.app.data.db.entity

import androidx.room.Entity

/** One row per calendar day (yyyy-MM-dd) the learner engaged with the app. */
@Entity(tableName = "daily_streak_entry", primaryKeys = ["date"])
data class DailyStreakEntry(
    val date: String,
    val goalCompleted: Boolean,
    val xpEarned: Int
)
