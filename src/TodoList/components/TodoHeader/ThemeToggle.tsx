import { useTheme } from '../../../theme/ThemeContext';
import '../../TodoList.css'


function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle