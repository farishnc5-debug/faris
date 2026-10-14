package com.linguastep.app.data.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.linguastep.app.data.db.entity.WordMastery
import kotlinx.coroutines.flow.Flow

@Dao
interface WordMasteryDao {

    @Query("SELECT * FROM word_mastery WHERE levelTier = :tier ORDER BY syllables, word")
    fun observeByTier(tier: Int): Flow<List<WordMastery>>

    @Query("SELECT * FROM word_mastery WHERE id = :id")
    suspend fun getById(id: Int): WordMastery?

    @Query("SELECT COUNT(*) FROM word_mastery WHERE masteryStage = 3")
    fun observeMasteredCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM word_mastery")
    suspend fun count(): Int

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(words: List<WordMastery>)

    @Update
    suspend fun update(word: WordMastery)

    @Query("UPDATE word_mastery SET masteryStage = :stage, lastPracticed = :timestamp WHERE id = :id")
    suspend fun updateStage(id: Int, stage: Int, timestamp: Long)
}
