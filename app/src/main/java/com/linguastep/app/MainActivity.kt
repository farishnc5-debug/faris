package com.linguastep.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.linguastep.app.ui.theme.LinguaStepTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as LinguaStepApplication
        setContent {
            LinguaStepTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    LinguaStepApp(app)
                }
            }
        }
    }
}
