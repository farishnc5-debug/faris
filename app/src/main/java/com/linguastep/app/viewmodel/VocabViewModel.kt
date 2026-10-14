package com.linguastep.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.linguastep.app.data.db.entity.WordMastery
import com.linguastep.app.data.repository.ProgressRepository
import com.linguastep.app.data.repository.VocabRepository
import com.linguastep.app.tts.TtsManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlin.random.Random

enum class SlotState { DEFAULT, SELECTED, CORRECT, WRONG }

data class LetterSlot(
    val targetLetter: Char,
    val candidates: List<Char> = emptyList(),
    var filledLetter: Char? = null,
    var state: SlotState = SlotState.DEFAULT
)

data class VocabUiState(
    val tier: Int = 1,
    val words: List<WordMastery> = emptyList(),
    val currentWord: WordMastery? = null,
    val stage: Int = 1, // 1 = guided, 2 = reinforcement, 3 = unassisted recall
    val slots: List<LetterSlot> = emptyList(),
    val activeSlotIndex: Int = 0,
    val isWordComplete: Boolean = false,
    val showMasteredBanner: Boolean = false,
    val stage3Error: Boolean = false
)

class VocabViewModel(
    private val vocabRepository: VocabRepository,
    private val progressRepository: ProgressRepository,
    private val ttsManager: TtsManager
) : ViewModel() {

    private val _tier = MutableStateFlow(1)
    private val _state = MutableStateFlow(VocabUiState())
    val uiState: StateFlow<VocabUiState> = _state

    fun wordsForTier(tier: Int) = vocabRepository.observeByTier(tier).stateIn(
        viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList()
    )

    fun selectTier(tier: Int) {
        _tier.value = tier
        _state.value = _state.value.copy(tier = tier)
    }

    fun startPractice(word: WordMastery) {
        val startingStage = when (word.masteryStage) {
            0 -> 1
            1 -> 2
            2 -> 3
            else -> 1 // revisiting a mastered word restarts from guided practice
        }
        _state.value = VocabUiState(
            tier = word.levelTier,
            currentWord = word,
            stage = startingStage,
            slots = buildSlots(word.word, startingStage)
        )
        speakCurrentWord()
    }

    fun speakCurrentWord() {
        _state.value.currentWord?.let { ttsManager.speak(it.word) }
    }

    /** Called when the learner taps a candidate letter block for the active slot (stages 1 & 2). */
    fun selectCandidate(slotIndex: Int, letter: Char) {
        val state = _state.value
        if (state.isWordComplete || slotIndex != state.activeSlotIndex) return

        val slots = state.slots.toMutableList()
        val slot = slots[slotIndex]
        val isCorrect = letter == slot.targetLetter

        slots[slotIndex] = slot.copy(
            filledLetter = letter,
            state = if (isCorrect) SlotState.CORRECT else SlotState.WRONG
        )
        _state.value = state.copy(slots = slots)

        if (isCorrect) {
            advanceAfterCorrectSlot(slotIndex)
        }
        // On wrong pick: block turns red, correct block is highlighted green via UI reading
        // slot.targetLetter against candidates; learner retries the same slot.
    }

    /** Called for stage 3 unassisted recall, where the learner spells with no candidate highlighting. */
    fun submitRecallLetter(slotIndex: Int, letter: Char) {
        val state = _state.value
        if (state.isWordComplete || slotIndex != state.activeSlotIndex) return

        val slots = state.slots.toMutableList()
        val slot = slots[slotIndex]
        val isCorrect = letter == slot.targetLetter

        if (isCorrect) {
            slots[slotIndex] = slot.copy(filledLetter = letter, state = SlotState.CORRECT)
            _state.value = state.copy(slots = slots, stage3Error = false)
            advanceAfterCorrectSlot(slotIndex)
        } else {
            // Error: show 'X' feedback, then clear the slot so the learner can retry.
            _state.value = state.copy(stage3Error = true)
        }
    }

    fun clearStage3Error() {
        _state.value = _state.value.copy(stage3Error = false)
    }

    /** Lets the learner step back from Stage 3 to guided Stage 1 practice. */
    fun rewindToGuided() {
        val word = _state.value.currentWord ?: return
        _state.value = VocabUiState(
            tier = word.levelTier,
            currentWord = word,
            stage = 1,
            slots = buildSlots(word.word, 1)
        )
        speakCurrentWord()
    }

    fun dismissMasteredBanner() {
        _state.value = _state.value.copy(showMasteredBanner = false)
    }

    /** Leaves the practice flow back to the tier word list. */
    fun exitPractice() {
        _state.value = VocabUiState(tier = _tier.value)
    }

    private fun advanceAfterCorrectSlot(filledIndex: Int) {
        val state = _state.value
        val nextIndex = filledIndex + 1
        if (nextIndex < state.slots.size) {
            _state.value = state.copy(activeSlotIndex = nextIndex)
        } else {
            onWordSolved()
        }
    }

    private fun onWordSolved() {
        val state = _state.value
        val word = state.currentWord ?: return
        _state.value = state.copy(isWordComplete = true)

        viewModelScope.launch {
            when (state.stage) {
                1 -> vocabRepository.setStage(word.id, 1)
                2 -> vocabRepository.setStage(word.id, 2)
                3 -> {
                    vocabRepository.setStage(word.id, 3)
                    progressRepository.recordDailyGoalCompletion(xpEarned = 10)
                    _state.value = _state.value.copy(showMasteredBanner = true)
                }
            }
        }
    }

    /** Moves from the just-completed stage into the next stage for the same word. */
    fun advanceToNextStage() {
        val word = _state.value.currentWord ?: return
        val nextStage = (_state.value.stage + 1).coerceAtMost(3)
        _state.value = VocabUiState(
            tier = word.levelTier,
            currentWord = word,
            stage = nextStage,
            slots = buildSlots(word.word, nextStage)
        )
        speakCurrentWord()
    }

    private fun buildSlots(word: String, stage: Int): List<LetterSlot> {
        val alphabet = ('A'..'Z').toList()
        return word.map { target ->
            if (stage == 3) {
                LetterSlot(targetLetter = target)
            } else {
                val distractors = alphabet.filter { it != target }.shuffled(Random(target.code + stage))
                val candidateCount = if (stage == 1) 2 else 3
                val candidates = (listOf(target) + distractors.take(candidateCount - 1)).shuffled()
                LetterSlot(targetLetter = target, candidates = candidates)
            }
        }
    }

    companion object {
        fun factory(
            vocabRepository: VocabRepository,
            progressRepository: ProgressRepository,
            ttsManager: TtsManager
        ) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T =
                VocabViewModel(vocabRepository, progressRepository, ttsManager) as T
        }
    }
}
