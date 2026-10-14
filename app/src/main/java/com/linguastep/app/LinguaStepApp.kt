package com.linguastep.app

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.linguastep.app.nav.NavDestination
import com.linguastep.app.ui.screens.DashboardScreen
import com.linguastep.app.ui.screens.LessonsScreen
import com.linguastep.app.ui.screens.PlacementTestScreen
import com.linguastep.app.ui.screens.VocabListScreen
import com.linguastep.app.ui.screens.VocabPracticeScreen
import com.linguastep.app.viewmodel.DashboardViewModel
import com.linguastep.app.viewmodel.LessonsViewModel
import com.linguastep.app.viewmodel.TestViewModel
import com.linguastep.app.viewmodel.VocabViewModel

@Composable
fun LinguaStepApp(app: LinguaStepApplication) {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            NavigationBar {
                val backStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = backStackEntry?.destination

                NavDestination.all.forEach { destination ->
                    val selected = currentDestination?.hierarchy?.any { it.route == destination.route } == true
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(destination.icon, contentDescription = destination.label) },
                        label = { Text(destination.label) }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NavDestination.Lessons.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(NavDestination.Lessons.route) {
                val viewModel: LessonsViewModel = viewModel(
                    factory = LessonsViewModel.factory(app.progressRepository, app.ttsManager)
                )
                LessonsScreen(viewModel)
            }

            composable(NavDestination.Vocabulary.route) {
                val viewModel: VocabViewModel = viewModel(
                    factory = VocabViewModel.factory(app.vocabRepository, app.progressRepository, app.ttsManager)
                )
                val state by viewModel.uiState.collectAsState()
                if (state.currentWord == null) {
                    VocabListScreen(viewModel) { word -> viewModel.startPractice(word) }
                } else {
                    VocabPracticeScreen(viewModel, onBack = { viewModel.exitPractice() })
                }
            }

            composable(NavDestination.Test.route) {
                val viewModel: TestViewModel = viewModel(
                    factory = TestViewModel.factory(app.progressRepository, app.ttsManager)
                )
                PlacementTestScreen(viewModel)
            }

            composable(NavDestination.Progress.route) {
                val viewModel: DashboardViewModel = viewModel(
                    factory = DashboardViewModel.factory(app.progressRepository, app.vocabRepository)
                )
                DashboardScreen(viewModel)
            }
        }
    }
}
