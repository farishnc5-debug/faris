package com.linguastep.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.linguastep.app.data.seed.PlacementSection
import com.linguastep.app.ui.theme.ErrorColor
import com.linguastep.app.ui.theme.SuccessColor
import com.linguastep.app.viewmodel.TestViewModel

@Composable
fun PlacementTestScreen(viewModel: TestViewModel) {
    val state by viewModel.uiState.collectAsState()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Test Your Language", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))

        if (state.isFinished) {
            PlacementResult(cefr = state.resultCefr ?: "A1", onRestart = { viewModel.restart() })
            return@Column
        }

        LinearProgressIndicator(progress = { state.progressFraction }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(16.dp))

        val question = state.currentQuestion ?: return@Column

        Text(
            when (question.section) {
                PlacementSection.LISTENING -> "Listening"
                PlacementSection.VOCAB_MATCH -> "Vocabulary matching"
                PlacementSection.READING -> "Reading comprehension"
            },
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(Modifier.height(8.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(question.prompt, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
            if (question.audioWord != null) {
                IconButton(onClick = { viewModel.playAudioForCurrentQuestion() }) {
                    Icon(Icons.Filled.VolumeUp, contentDescription = "Play audio")
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        question.options.forEach { option ->
            val isSelected = state.selectedOption == option
            val color = when {
                !isSelected -> MaterialTheme.colorScheme.primary
                option == question.correctAnswer -> SuccessColor
                else -> ErrorColor
            }
            OutlinedButton(
                onClick = { if (state.selectedOption == null) viewModel.selectOption(option) },
                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
            ) {
                Text(option, color = if (isSelected) color else MaterialTheme.colorScheme.onSurface)
            }
        }

        Spacer(Modifier.height(16.dp))

        Button(
            onClick = { viewModel.nextQuestion() },
            enabled = state.selectedOption != null,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Next")
        }
    }
}

@Composable
private fun PlacementResult(cefr: String, onRestart: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(top = 48.dp)) {
        Text("Your level: $cefr", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        Text(
            when (cefr) {
                "A1" -> "Beginner — we'll start you on short, simple words."
                "A2" -> "Elementary — you're ready for everyday vocabulary."
                "B1" -> "Intermediate — time for richer, multi-syllable words."
                else -> "Upper-Intermediate — let's tackle advanced vocabulary."
            }
        )
        Spacer(Modifier.height(24.dp))
        Button(onClick = onRestart) { Text("Retake test") }
    }
}
