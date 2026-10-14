package com.linguastep.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.linguastep.app.data.db.entity.DailyStreakEntry
import com.linguastep.app.data.db.entity.UserProgress
import com.linguastep.app.data.repository.ProgressRepository
import com.linguastep.app.data.repository.VocabRepository
import com.linguastep.app.notification.ReminderScheduler
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class DashboardUiState(
    val progress: UserProgress = UserProgress(),
    val streakHistory: List<DailyStreakEntry> = emptyList(),
    val wordsMastered: Int = 0
) {
    val accuracyPercent: Int
        get() = if (progress.quizzesTaken == 0) 0
        else (progress.quizzesCorrect * 100) / progress.quizzesTaken
}

class DashboardViewModel(
    private val progressRepository: ProgressRepository,
    private val vocabRepository: VocabRepository
) : ViewModel() {

    val uiState: StateFlow<DashboardUiState> = combine(
        progressRepository.observeProgress(),
        progressRepository.observeStreakHistory(),
        vocabRepository.observeMasteredCount()
    ) { progress, history, mastered ->
        DashboardUiState(progress = progress ?: UserProgress(), streakHistory = history, wordsMastered = mastered)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DashboardUiState())

    fun updateReminder(context: Context, hour: Int, minute: Int, enabled: Boolean) {
        viewModelScope.launch {
            progressRepository.updateReminder(hour, minute, enabled)
            if (enabled) {
                ReminderScheduler.scheduleDaily(context, hour, minute)
            } else {
                ReminderScheduler.cancel(context)
            }
        }
    }

    companion object {
        fun factory(progressRepository: ProgressRepository, vocabRepository: VocabRepository) =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    DashboardViewModel(progressRepository, vocabRepository) as T
            }
    }
}
