"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiCheckSquare,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import styles from "./Sidebar.module.css";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome,         label: "01" },
  { name: "Subjects",  href: "/subjects",  icon: FiBook,         label: "02" },
  { name: "Exams",     href: "/exams",     icon: FiCalendar,     label: "03" },
  { name: "Tasks",     href: "/tasks",     icon: FiCheckSquare,  label: "04" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandEyebrow}>Study Companion</div>
        <div className={styles.brandName}>
          <span className={styles.brandIcon}>📚</span>
          PlanMyStudy
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSectionLabel}>Navigation</div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.navNumber}>{item.label}</span>
              <Icon className={styles.navIcon} />
              <span className={styles.navText}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <Link
          href="/settings"
          className={`${styles.bottomLink} ${styles.settingsLink}`}
        >
          <FiSettings className={styles.bottomIcon} />
          <span className={styles.bottomText}>Settings</span>
        </Link>

        <button
          className={`${styles.bottomLink} ${styles.logoutLink}`}
          onClick={() => { window.location.href = "/signin"; }}
        >
          <FiLogOut className={styles.bottomIcon} />
          <span className={styles.bottomText}>Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerText}>© 2026 PlanMyStudy</div>
      </div>
    </aside>
  );
}