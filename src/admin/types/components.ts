import { LucideIcon } from "lucide-react";

export interface DashboardProps {
  language: "en" | "hi";
}

export interface ReportsProps {
  language: "en" | "hi";
}


export interface StatsCardProps {
  title: { en: string; hi: string }; // Multi-language titles
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: "blue" | "yellow" | "green" | "red" | "purple";
  language: "en" | "hi"; // Current language
  loading?: boolean; // Loading state
}

export interface HeaderProps {
  language: "en" | "hi";
  onMenuClick: () => void;
  onLanguageToggle: () => void;
  onSidebarToggle?: () => void;
}

export interface LayoutProps {
  language: "en" | "hi";
  onLanguageToggle: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "en" | "hi";
  isCollapsed?: boolean;
}

export interface HeaderProps {
  language: 'en' | 'hi';
  onMenuClick: () => void;
  onLanguageToggle: () => void;
  onSidebarToggle?: () => void;
  title: string;
  isDark: boolean;
  onThemeToggle: () => void;
  user?: { name?: string; role?: string };
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "en" | "hi";
  isCollapsed?: boolean;
  isDark?: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user?: { name?: string; role?: string };
}

export interface SettingsProps {
  isDark: boolean;
  onThemeToggle: () => void;
  language: "en" | "hi";
  onLanguageToggle: () => void;
}