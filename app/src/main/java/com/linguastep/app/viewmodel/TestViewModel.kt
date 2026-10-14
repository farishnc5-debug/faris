package com.linguastep.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.linguastep.app.data.repository.ProgressRepository
import com.linguastep.app.data.seed.PlacementQuestion
import com.linguastep.app.data.seed.PlacementTestSeed
import com.linguastep.app.tts.TtsManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class TestUiState(
    val questions: List<PlacementQuestion> = PlacementTestSeed.questions(),
    val currentIndex: Int = 0,
    val correctCount: Int = 0,
    val selectedOption: String? = null,
    val isFinished: Boolean = false,
    val resultCefr: String? = null
) {
    val currentQuestion: PlacementQuestion? get() = questions.getOrNull(currentIndex)
    val progressFraction: Float get() = if (questions.isEmpty()) 0f else currentIndex.toFloat() / questions.size
}

class TestViewModel(
    private val progressRepository: ProgressRepository,
    private val ttsManager: TtsManager
) : ViewModel() {

    private val _state = MutableStateFlow(TestUiState())
    val uiState: StateFlow<TestUiState> = _state

    fun playAudioForCurrentQuestion() {
        _state.value.currentQuestion?.audioWord?.let { ttsManager.speak(it) }
    }

    fun selectOption(option: String) {
        val state = _state.value
        val question = state.currentQuestion ?: return
        val isCorrect = option == question.correctAnswer
        _state.value = state.copy(
            selectedOption = option,
            correctCount = state.correctCount + if (isCorrect) 1 else 0
        )
    }

    fun nextQuestion() {
        val state = _state.value
        val nextIndex = state.currentIndex + 1
        if (nextIndex >= state.questions.size) {
            finishTest()
        } else {
            _state.value = state.copy(currentIndex = nextIndex, selectedOption = null)
        }
    }

    private fun finishTest() {
        val state = _state.value
        val cefr = PlacementTestSeed.tierForScore(state.correctCount, state.questions.size)
        _state.value = state.copy(isFinished = true, resultCefr = cefr)
        viewModelScope.launch { progressRepository.setProficiency(cefr) }
    }

    fun restart() {
        _state.value = TestUiState()
    }

    companion object {
        fun factory(progressRepository: ProgressRepository, ttsManager: TtsManager) =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T =
                    TestViewModel(progressRepository, ttsManager) as T
            }
    }
}
