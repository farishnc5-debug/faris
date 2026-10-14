package com.linguastep.app.data.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.linguastep.app.data.db.entity.UserProgress
import kotlinx.coroutines.flow.Flow

@Dao
interface UserProgressDao {

    @Query("SELECT * FROM user_progress WHERE id = 1")
    fun observe(): Flow<UserProgress?>

    @Query("SELECT * FROM user_progress WHERE id = 1")
    suspend fun get(): UserProgress?

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(progress: UserProgress)

    @Update
    suspend fun update(progress: UserProgress)
}
