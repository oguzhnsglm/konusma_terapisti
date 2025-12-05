import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { MascotProvider } from './context/MascotContext';
import ProtectedRoute from './components/ProtectedRoute';
import Mascot from './components/Mascot';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PracticePage from './pages/PracticePage';
import MiniGamesPage from './pages/MiniGamesPage';
import MemoryGamePage from './pages/MemoryGamePage';
import RhymeGamePage from './pages/RhymeGamePage';
import ColorGamePage from './pages/ColorGamePage';
import CountingGamePage from './pages/CountingGamePage';
import PuzzlePage from './pages/PuzzlePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProgressPage from './pages/ProgressPage';
import StorybookPage from './pages/StorybookPage';
import WorldMapPage from './pages/WorldMapPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <MascotProvider>
            <BrowserRouter>
              <Mascot />
              <Routes>
                <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/games" element={<MiniGamesPage />} />
              <Route path="/games/memory" element={<MemoryGamePage />} />
              <Route path="/games/rhyme" element={<RhymeGamePage />} />
              <Route path="/games/colors" element={<ColorGamePage />} />
              <Route path="/games/counting" element={<CountingGamePage />} />
              <Route path="/games/word-fill" element={<MiniGamesPage />} />
              <Route path="/puzzles" element={<PuzzlePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/storybook" element={<StorybookPage />} />
              <Route path="/world-map" element={<WorldMapPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </BrowserRouter>
          </MascotProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
