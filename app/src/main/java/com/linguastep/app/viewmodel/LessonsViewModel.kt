package com.linguastep.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.linguastep.app.data.repository.ProgressRepository
import com.linguastep.app.data.seed.DailyLesson
import com.linguastep.app.data.seed.DailyLessonSeed
import com.linguastep.app.tts.TtsManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.temporal.ChronoUnit

data class LessonUiState(
    val lesson: DailyLesson = DailyLessonSeed.lessonForDayIndex(0),
    val fillBlankSelection: String? = null,
    val fillBlankCorrect: Boolean? = null,
    val sentenceOrder: List<String> = emptyList(),
    val sentenceCorrect: Boolean? = null,
    val lessonCompletedToday: Boolean = false
)

class LessonsViewModel(
    private val progressRepository: ProgressRepository,
    private val ttsManager: TtsManager
) : ViewModel() {

    private val _state = MutableStateFlow(LessonUiState(lesson = todaysLesson()))
    val uiState: StateFlow<LessonUiState> = _state

    init {
        viewModelScope.launch {
            val completed = progressRepository.hasCompletedGoalToday()
            _state.value = _state.value.copy(lessonCompletedToday = completed)
        }
    }

    private fun todaysLesson(): DailyLesson {
        val epochDay = LocalDate.now().toEpochDay()
        val dayIndex = ChronoUnit.DAYS.between(LocalDate.ofEpochDay(0), LocalDate.ofEpochDay(epochDay)).toInt()
        return DailyLessonSeed.lessonForDayIndex(dayIndex)
    }

    fun speakWord(word: String) = ttsManager.speak(word)

    fun selectFillBlankOption(option: String) {
        val correct = option == _state.value.lesson.fillBlankAnswer
        _state.value = _state.value.copy(fillBlankSelection = option, fillBlankCorrect = correct)
        viewModelScope.launch { progressRepository.recordQuizAnswer(correct) }
    }

    fun submitSentenceOrder(order: List<String>) {
        val correct = order.joinToString(" ") == _state.value.lesson.sentenceBuildingAnswer
        _state.value = _state.value.copy(sentenceOrder = order, sentenceCorrect = correct)
        viewModelScope.launch { progressRepository.recordQuizAnswer(correct) }
    }

    fun completeLesson() {
        if (_state.value.lessonCompletedToday) return
        viewModelScope.launch {
            progressRepository.recordDailyGoalCompletion(xpEarned = 15)
            _state.value = _state.value.copy(lessonCompletedToday = true)
        }
    }

    companion object {
        fun factory(progressRepository: ProgressRepository, ttsManager: TtsManager) =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    LessonsViewModel(progressRepository, ttsManager) as T
            }
    }
}
