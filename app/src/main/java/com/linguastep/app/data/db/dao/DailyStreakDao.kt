package com.linguastep.app.data.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.linguastep.app.data.db.entity.DailyStreakEntry
import kotlinx.coroutines.flow.Flow

@Dao
interface DailyStreakDao {

    @Query("SELECT * FROM daily_streak_entry ORDER BY date DESC LIMIT :limit")
    fun observeRecent(limit: Int = 42): Flow<List<DailyStreakEntry>>

    @Query("SELECT * FROM daily_streak_entry WHERE date = :date")
    suspend fun getByDate(date: String): DailyStreakEntry?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entry: DailyStreakEntry)
}
