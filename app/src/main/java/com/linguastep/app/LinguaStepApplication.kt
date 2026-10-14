package com.linguastep.app

import android.app.Application
import com.linguastep.app.data.db.AppDatabase
import com.linguastep.app.data.repository.ProgressRepository
import com.linguastep.app.data.repository.VocabRepository
import com.linguastep.app.notification.NotificationHelper
import com.linguastep.app.tts.TtsManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class LinguaStepApplication : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    val database: AppDatabase by lazy { AppDatabase.getInstance(this) }
    val vocabRepository: VocabRepository by lazy { VocabRepository(database.wordMasteryDao()) }
    val progressRepository: ProgressRepository by lazy {
        ProgressRepository(database.userProgressDao(), database.dailyStreakDao())
    }
    val ttsManager: TtsManager by lazy { TtsManager(this) }

    override fun onCreate() {
        super.onCreate()
        NotificationHelper.createChannel(this)
        applicationScope.launch {
            vocabRepository.ensureSeeded()
            progressRepository.ensureInitialized()
        }
    }
}
