package com.linguastep.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.linguastep.app.LinguaStepApplication
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return

        val app = context.applicationContext as LinguaStepApplication
        val pendingResult = goAsync()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Re-arm using the last persisted reminder settings, if notifications were enabled.
                val current = app.database.userProgressDao().get()
                if (current != null && current.notificationsEnabled) {
                    ReminderScheduler.scheduleDaily(context, current.reminderHour, current.reminderMinute)
                }
            } finally {
                pendingResult.finish()
            }
        }
    }
}
