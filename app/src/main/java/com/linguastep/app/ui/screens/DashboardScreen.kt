package com.linguastep.app.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.linguastep.app.ui.components.StreakCalendar
import com.linguastep.app.ui.theme.StreakColor
import com.linguastep.app.ui.theme.SuccessColor
import com.linguastep.app.viewmodel.DashboardViewModel

@Composable
fun DashboardScreen(viewModel: DashboardViewModel) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    var pendingReminderToEnable by remember { mutableStateOf<Pair<Int, Int>?>(null) }
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        val pending = pendingReminderToEnable
        if (granted && pending != null) {
            viewModel.updateReminder(context, pending.first, pending.second, true)
        }
        pendingReminderToEnable = null
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Progress Dashboard", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            StatCard(title = "Streak", value = "${state.progress.currentStreak}d", color = StreakColor, modifier = Modifier.weight(1f))
            StatCard(title = "Mastered", value = "${state.wordsMastered}", color = SuccessColor, modifier = Modifier.weight(1f))
        }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            StatCard(title = "Accuracy", value = "${state.accuracyPercent}%", color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f))
            StatCard(title = "Total XP", value = "${state.progress.totalXp}", color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f))
        }

        Spacer(Modifier.height(20.dp))
        AssistChip(onClick = {}, label = { Text("CEFR level: ${state.progress.proficiencyLevel}") })

        Spacer(Modifier.height(20.dp))
        Text("This week", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))
        StreakCalendar(history = state.streakHistory)

        Spacer(Modifier.height(24.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Daily reminder", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))

                var hour by remember(state.progress.reminderHour) { mutableIntStateOf(state.progress.reminderHour) }
                var minute by remember(state.progress.reminderMinute) { mutableIntStateOf(state.progress.reminderMinute) }
                var enabled by remember(state.progress.notificationsEnabled) {
                    mutableStateOf(state.progress.notificationsEnabled)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(String.format("%02d:%02d", hour, minute), style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
                    Switch(
                        checked = enabled,
                        onCheckedChange = { checked ->
                            enabled = checked
                            if (!checked) {
                                viewModel.updateReminder(context, hour, minute, false)
                                return@Switch
                            }
                            val needsRuntimePermission = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                                context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
                            if (needsRuntimePermission) {
                                pendingReminderToEnable = hour to minute
                                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                            } else {
                                viewModel.updateReminder(context, hour, minute, true)
                            }
                        }
                    )
                }

                Spacer(Modifier.height(8.dp))
                TextButton(onClick = {
                    showTimePicker(context, hour, minute) { newHour, newMinute ->
                        hour = newHour
                        minute = newMinute
                        viewModel.updateReminder(context, newHour, newMinute, enabled)
                    }
                }) {
                    Text("Change reminder time")
                }
            }
        }
    }
}

@Composable
private fun StatCard(title: String, value: String, color: androidx.compose.ui.graphics.Color, modifier: Modifier = Modifier) {
    Card(modifier = modifier) {
        Column(Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.bodyMedium)
            Spacer(Modifier.height(4.dp))
            Text(value, style = MaterialTheme.typography.headlineMedium, color = color)
        }
    }
}

private fun showTimePicker(
    context: android.content.Context,
    initialHour: Int,
    initialMinute: Int,
    onTimeSet: (Int, Int) -> Unit
) {
    android.app.TimePickerDialog(
        context,
        { _, hour, minute -> onTimeSet(hour, minute) },
        initialHour,
        initialMinute,
        true
    ).show()
}
