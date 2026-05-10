(function() {
  try {
    var appearance = JSON.parse(localStorage.getItem('todo_appearance') || '{}');
    var theme = appearance.theme || localStorage.getItem('theme');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    if (appearance.glassmorphism !== false) {
      document.documentElement.classList.add('glass-enabled');
    }
    if (appearance.compact) {
      document.documentElement.classList.add('compact-mode');
    }
  } catch (e) {}
})();
