package com.linguastep.app.tts

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.TextToSpeech.QUEUE_FLUSH
import java.util.Locale

/**
 * Wraps Android's native TextToSpeech engine for instant, offline-capable
 * American English pronunciation.
 */
class TtsManager(context: Context) {

    private var isReady = false
    private val pendingUtterances = mutableListOf<String>()

    private val tts: TextToSpeech = TextToSpeech(context.applicationContext) { status ->
        if (status == TextToSpeech.SUCCESS) {
            isReady = true
            pendingUtterances.forEach { speakInternal(it) }
            pendingUtterances.clear()
        }
    }.apply {
        language = Locale.US
    }

    fun speak(text: String) {
        if (isReady) {
            tts.language = Locale.US
            speakInternal(text)
        } else {
            pendingUtterances.add(text)
        }
    }

    private fun speakInternal(text: String) {
        tts.speak(text, QUEUE_FLUSH, null, "linguastep_utterance_${text.hashCode()}")
    }

    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
