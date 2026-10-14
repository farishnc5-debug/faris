package com.linguastep.app.data.repository

import com.linguastep.app.data.db.dao.DailyStreakDao
import com.linguastep.app.data.db.dao.UserProgressDao
import com.linguastep.app.data.db.entity.DailyStreakEntry
import com.linguastep.app.data.db.entity.UserProgress
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class ProgressRepository(
    private val userProgressDao: UserProgressDao,
    private val dailyStreakDao: DailyStreakDao
) {
    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE

    fun observeProgress(): Flow<UserProgress?> = userProgressDao.observe()

    fun observeStreakHistory(limit: Int = 42): Flow<List<DailyStreakEntry>> =
        dailyStreakDao.observeRecent(limit)

    suspend fun ensureInitialized() {
        if (userProgressDao.get() == null) {
            userProgressDao.insert(UserProgress())
        }
    }

    suspend fun setProficiency(level: String) {
        val current = userProgressDao.get() ?: UserProgress()
        userProgressDao.update(current.copy(proficiencyLevel = level, placementTestCompleted = true))
    }

    suspend fun updateReminder(hour: Int, minute: Int, enabled: Boolean) {
        val current = userProgressDao.get() ?: UserProgress()
        userProgressDao.update(current.copy(reminderHour = hour, reminderMinute = minute, notificationsEnabled = enabled))
    }

    suspend fun recordQuizAnswer(correct: Boolean) {
        val current = userProgressDao.get() ?: UserProgress()
        userProgressDao.update(
            current.copy(
                quizzesTaken = current.quizzesTaken + 1,
                quizzesCorrect = current.quizzesCorrect + if (correct) 1 else 0
            )
        )
    }

    /** Call when the learner completes today's 2-minute goal (a lesson or a mastered word). */
    suspend fun recordDailyGoalCompletion(xpEarned: Int) {
        val today = LocalDate.now()
        val todayKey = today.format(dateFormatter)
        val existing = dailyStreakDao.getByDate(todayKey)
        if (existing?.goalCompleted == true) {
            // Already recorded today; just add XP.
            dailyStreakDao.upsert(existing.copy(xpEarned = existing.xpEarned + xpEarned))
            addXp(xpEarned)
            return
        }

        dailyStreakDao.upsert(DailyStreakEntry(todayKey, goalCompleted = true, xpEarned = xpEarned))

        val current = userProgressDao.get() ?: UserProgress()
        val yesterdayKey = today.minusDays(1).format(dateFormatter)
        val newStreak = if (current.lastActiveDate == yesterdayKey || current.lastActiveDate == todayKey) {
            current.currentStreak + 1
        } else {
            1
        }
        userProgressDao.update(
            current.copy(
                totalXp = current.totalXp + xpEarned,
                currentStreak = newStreak,
                longestStreak = maxOf(current.longestStreak, newStreak),
                lastActiveDate = todayKey
            )
        )
    }

    private suspend fun addXp(amount: Int) {
        val current = userProgressDao.get() ?: UserProgress()
        userProgressDao.update(current.copy(totalXp = current.totalXp + amount))
    }

    suspend fun hasCompletedGoalToday(): Boolean {
        val todayKey = LocalDate.now().format(dateFormatter)
        return dailyStreakDao.getByDate(todayKey)?.goalCompleted == true
    }
}
