package com.linguastep.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.linguastep.app.data.db.entity.DailyStreakEntry
import com.linguastep.app.ui.theme.StreakColor
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/** Shows the last 7 days as dots: amber-filled if the daily goal was completed. */
@Composable
fun StreakCalendar(history: List<DailyStreakEntry>, modifier: Modifier = Modifier) {
    val formatter = DateTimeFormatter.ISO_LOCAL_DATE
    val completedDates = history.filter { it.goalCompleted }.map { it.date }.toSet()
    val today = LocalDate.now()

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        for (offset in 6 downTo 0) {
            val date = today.minusDays(offset.toLong())
            val key = date.format(formatter)
            val completed = completedDates.contains(key)
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .background(
                        if (completed) StreakColor else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                        CircleShape
                    )
            )
        }
    }
}
