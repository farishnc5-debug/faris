package com.linguastep.app.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.linguastep.app.data.db.dao.DailyStreakDao
import com.linguastep.app.data.db.dao.UserProgressDao
import com.linguastep.app.data.db.dao.WordMasteryDao
import com.linguastep.app.data.db.entity.DailyStreakEntry
import com.linguastep.app.data.db.entity.UserProgress
import com.linguastep.app.data.db.entity.WordMastery

@Database(
    entities = [WordMastery::class, UserProgress::class, DailyStreakEntry::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun wordMasteryDao(): WordMasteryDao
    abstract fun userProgressDao(): UserProgressDao
    abstract fun dailyStreakDao(): DailyStreakDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "linguastep.db"
                ).build().also { INSTANCE = it }
            }
    }
}
