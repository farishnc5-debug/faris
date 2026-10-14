package com.linguastep.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.linguastep.app.data.db.entity.WordMastery
import com.linguastep.app.ui.components.LetterBlock
import com.linguastep.app.ui.theme.ErrorColor
import com.linguastep.app.ui.theme.SuccessColor
import com.linguastep.app.viewmodel.SlotState
import com.linguastep.app.viewmodel.VocabViewModel

private val tierLabels = mapOf(
    1 to "Tier 1 · 2-3 letters",
    2 to "Tier 2 · 4-5 letters",
    3 to "Tier 3 · 6-7 letters",
    4 to "Tier 4 · 8+ letters"
)

@Composable
fun VocabListScreen(viewModel: VocabViewModel, onWordSelected: (WordMastery) -> Unit) {
    val state by viewModel.uiState.collectAsState()
    val words by viewModel.wordsForTier(state.tier).collectAsState()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Improve Your Vocabulary", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(12.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(tierLabels.keys.toList()) { tier ->
                FilterChip(
                    selected = state.tier == tier,
                    onClick = { viewModel.selectTier(tier) },
                    label = { Text(tierLabels[tier] ?: "Tier $tier") }
                )
            }
        }

        Spacer(Modifier.height(12.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(words, key = { it.id }) { word ->
                val stageLabel = when (word.masteryStage) {
                    0 -> "Not started"
                    1 -> "Stage 1 passed"
                    2 -> "Stage 2 passed"
                    else -> "Mastered!"
                }
                Card(onClick = { onWordSelected(word) }, modifier = Modifier.fillMaxWidth()) {
                    ListItem(
                        headlineContent = { Text(word.word) },
                        supportingContent = { Text(stageLabel) }
                    )
                }
            }
        }
    }
}

@Composable
fun VocabPracticeScreen(viewModel: VocabViewModel, onBack: () -> Unit) {
    val state by viewModel.uiState.collectAsState()
    val word = state.currentWord ?: return

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Filled.ArrowBack, contentDescription = "Back to vocabulary list")
            }
            Text(word.word, style = MaterialTheme.typography.headlineMedium)
            IconButton(onClick = { viewModel.speakCurrentWord() }) {
                Icon(Icons.Filled.VolumeUp, contentDescription = "Hear pronunciation of ${word.word}")
            }
        }

        Text(
            when (state.stage) {
                1 -> "Stage 1: Guided letter blocks"
                2 -> "Stage 2: Reinforcement drill"
                else -> "Stage 3: Unassisted recall"
            },
            style = MaterialTheme.typography.titleMedium
        )
        Text(word.definition, style = MaterialTheme.typography.bodyMedium)

        Spacer(Modifier.height(24.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.wrapContentWidth()) {
            state.slots.forEachIndexed { index, slot ->
                LetterBlock(letter = slot.filledLetter, state = slot.state)
            }
        }

        Spacer(Modifier.height(32.dp))

        if (state.stage == 3) {
            Stage3Keyboard(
                activeSlotLetter = state.slots.getOrNull(state.activeSlotIndex)?.targetLetter,
                showError = state.stage3Error,
                onLetterTap = { letter ->
                    viewModel.submitRecallLetter(state.activeSlotIndex, letter)
                }
            )
            if (state.stage3Error) {
                Spacer(Modifier.height(12.dp))
                Text("✗ Try again", color = ErrorColor, style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))
                Button(onClick = { viewModel.rewindToGuided() }) {
                    Text("Step back to guided mode")
                }
            }
        } else {
            val activeSlot = state.slots.getOrNull(state.activeSlotIndex)
            if (activeSlot != null) {
                Text("Choose the correct letter:", style = MaterialTheme.typography.bodyMedium)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    activeSlot.candidates.forEach { candidate ->
                        val candidateState = when {
                            activeSlot.state == SlotState.WRONG && candidate == activeSlot.targetLetter -> SlotState.CORRECT
                            else -> SlotState.DEFAULT
                        }
                        LetterBlock(
                            letter = candidate,
                            state = candidateState,
                            onClick = { viewModel.selectCandidate(state.activeSlotIndex, candidate) }
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        if (state.isWordComplete) {
            if (state.showMasteredBanner) {
                MasteredBanner(word = word.word)
            } else {
                Text("Nice work! Ready for the next stage.", color = SuccessColor, style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(12.dp))
                Button(onClick = { viewModel.advanceToNextStage() }) {
                    Text("Continue to Stage ${state.stage + 1}")
                }
            }
        }
    }
}

@Composable
private fun Stage3Keyboard(activeSlotLetter: Char?, showError: Boolean, onLetterTap: (Char) -> Unit) {
    val alphabet = ('A'..'Z').toList()
    Column {
        for (rowStart in alphabet.indices step 9) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                alphabet.subList(rowStart, minOf(rowStart + 9, alphabet.size)).forEach { letter ->
                    LetterBlock(
                        letter = letter,
                        state = SlotState.DEFAULT,
                        modifier = Modifier,
                        onClick = { onLetterTap(letter) }
                    )
                }
            }
            Spacer(Modifier.height(6.dp))
        }
    }
}

@Composable
private fun MasteredBanner(word: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            "🎉 $word Mastered!",
            color = SuccessColor,
            style = MaterialTheme.typography.headlineMedium
        )
    }
}
