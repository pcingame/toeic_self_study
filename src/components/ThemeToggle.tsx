"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

function applyTheme(choice: ThemeChoice) {
  if (choice === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    document.documentElement.setAttribute("data-theme", choice);
    localStorage.setItem("theme", choice);
  }
}

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const ICON: Record<ThemeChoice, string> = {
  system: "🖥️",
  light: "☀️",
  dark: "🌙",
};

const LABEL: Record<ThemeChoice, string> = {
  system: "Tự động",
  light: "Sáng",
  dark: "Tối",
};

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(stored);
    }
  }, []);

  function cycle() {
    const next = NEXT[choice];
    setChoice(next);
    applyTheme(next);
  }

  return (
    <button
      onClick={cycle}
      className="btn-icon"
      title={`Giao diện: ${LABEL[choice]} (bấm để đổi)`}
      aria-label="Đổi giao diện sáng/tối"
    >
      <span aria-hidden="true">{ICON[choice]}</span>
    </button>
  );
}
