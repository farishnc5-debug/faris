package com.linguastep.app.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.linguastep.app.ui.theme.ErrorColor
import com.linguastep.app.ui.theme.SuccessColor
import com.linguastep.app.viewmodel.SlotState

/** A tactile raised letter block: 52dp tall, minimum 48dp touch target. */
@Composable
fun LetterBlock(
    letter: Char?,
    state: SlotState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    onClick: () -> Unit = {}
) {
    val backgroundColor by animateColorAsState(
        targetValue = when (state) {
            SlotState.DEFAULT -> MaterialTheme.colorScheme.surface
            SlotState.SELECTED -> MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
            SlotState.CORRECT -> SuccessColor
            SlotState.WRONG -> ErrorColor
        },
        label = "letterBlockColor"
    )
    val textColor = if (state == SlotState.CORRECT || state == SlotState.WRONG) Color.White
    else MaterialTheme.colorScheme.onSurface

    Box(
        modifier = modifier
            .size(width = 48.dp, height = 52.dp)
            .background(backgroundColor, RoundedCornerShape(10.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(10.dp))
            .semantics { contentDescription = letter?.toString() ?: "Empty letter slot" }
            .clickable(enabled = enabled, onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = letter?.toString() ?: "",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}
