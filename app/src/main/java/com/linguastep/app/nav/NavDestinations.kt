package com.linguastep.app.nav

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Spellcheck
import androidx.compose.ui.graphics.vector.ImageVector

sealed class NavDestination(val route: String, val label: String, val icon: ImageVector) {
    data object Lessons : NavDestination("lessons", "Lessons", Icons.Filled.MenuBook)
    data object Vocabulary : NavDestination("vocabulary", "Vocabulary", Icons.Filled.Spellcheck)
    data object Test : NavDestination("test", "Test", Icons.Filled.Assessment)
    data object Progress : NavDestination("progress", "Progress", Icons.Filled.School)

    companion object {
        val all = listOf(Lessons, Vocabulary, Test, Progress)
    }
}

const val VOCAB_PRACTICE_ROUTE = "vocabulary/practice/{wordId}"
fun vocabPracticeRoute(wordId: Int) = "vocabulary/practice/$wordId"
