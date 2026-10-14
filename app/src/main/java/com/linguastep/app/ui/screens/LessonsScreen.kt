package com.linguastep.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.linguastep.app.ui.theme.ErrorColor
import com.linguastep.app.ui.theme.SuccessColor
import com.linguastep.app.viewmodel.LessonsViewModel

@Composable
fun LessonsScreen(viewModel: LessonsViewModel) {
    val state by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Today's 2-Minute Lesson", style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.height(4.dp))
            if (state.lessonCompletedToday) {
                AssistChip(onClick = {}, label = { Text("Completed today ✓") })
            } else {
                AssistChip(onClick = {}, label = { Text("Goal: 2 minutes") })
            }
        }

        item {
            Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Target words", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    state.lesson.targetWords.forEach { word ->
                        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                            Text(word, style = MaterialTheme.typography.bodyLarge)
                            IconButton(onClick = { viewModel.speakWord(word) }) {
                                Icon(Icons.Filled.VolumeUp, contentDescription = "Hear pronunciation of $word")
                            }
                        }
                    }
                }
            }
        }

        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Fill in the blank", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text(state.lesson.fillBlankSentence, style = MaterialTheme.typography.bodyLarge)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        state.lesson.fillBlankOptions.forEach { option ->
                            val isSelected = state.fillBlankSelection == option
                            val color = when {
                                !isSelected -> MaterialTheme.colorScheme.primary
                                state.fillBlankCorrect == true -> SuccessColor
                                else -> ErrorColor
                            }
                            OutlinedButton(onClick = { viewModel.selectFillBlankOption(option) }) {
                                Text(option, color = if (isSelected) color else MaterialTheme.colorScheme.onSurface)
                            }
                        }
                    }
                }
            }
        }

        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Build the sentence", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Tap the words in the correct order: ${state.lesson.sentenceBuildingWords.joinToString(" / ")}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Spacer(Modifier.height(12.dp))
                    Button(onClick = { viewModel.submitSentenceOrder(state.lesson.sentenceBuildingWords) }) {
                        Text("Check sentence order")
                    }
                    state.sentenceCorrect?.let { correct ->
                        Spacer(Modifier.height(8.dp))
                        Text(
                            if (correct) "Correct! Great sentence building." else "Not quite — review the word order.",
                            color = if (correct) SuccessColor else ErrorColor
                        )
                    }
                }
            }
        }

        item {
            Button(
                onClick = { viewModel.completeLesson() },
                modifier = Modifier.fillMaxWidth(),
                enabled = !state.lessonCompletedToday
            ) {
                Text(if (state.lessonCompletedToday) "Lesson complete" else "Mark lesson complete")
            }
        }
    }
}
