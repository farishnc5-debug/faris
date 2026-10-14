package com.linguastep.app.data.repository

import com.linguastep.app.data.db.dao.WordMasteryDao
import com.linguastep.app.data.db.entity.WordMastery
import com.linguastep.app.data.seed.VocabularySeed
import kotlinx.coroutines.flow.Flow

class VocabRepository(private val wordMasteryDao: WordMasteryDao) {

    suspend fun ensureSeeded() {
        if (wordMasteryDao.count() == 0) {
            wordMasteryDao.insertAll(VocabularySeed.words())
        }
    }

    fun observeByTier(tier: Int): Flow<List<WordMastery>> = wordMasteryDao.observeByTier(tier)

    fun observeMasteredCount(): Flow<Int> = wordMasteryDao.observeMasteredCount()

    suspend fun getById(id: Int): WordMastery? = wordMasteryDao.getById(id)

    suspend fun setStage(id: Int, stage: Int) {
        wordMasteryDao.updateStage(id, stage, System.currentTimeMillis())
    }
}
