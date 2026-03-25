"use client";

import { FiBook, FiCalendar, FiCheckSquare, FiPlus } from "react-icons/fi";
import styles from "./Dashboard.module.css";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here’s an overview of your study plan.</p>
      </header>

      {/* Metrics Section */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiBook />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Subjects</span>
            <span className={styles.metricValue}>0</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiCalendar />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Upcoming Exams</span>
            <span className={styles.metricValue}>0</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiCheckSquare />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Pending Tasks</span>
            <span className={styles.metricValue}>0</span>
          </div>
        </div>
      </div>

      {/* Today's Tasks & Recent Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Today's Tasks</h2>
            <Link href="/tasks">
              <button className={styles.actionBtn}>
                <FiPlus className="inline mr-1" /> New Task
              </button>
            </Link>
          </div>
          <div className={styles.emptyState}>
            <FiCheckSquare className={styles.emptyStateIcon} />
            <p className={styles.emptyStateText}>You have no tasks for today! Enjoy your free time or get ahead on studying.</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Exams</h2>
            <Link href="/exams">
              <button className={styles.actionBtn}>
                <FiPlus className="inline mr-1" /> New Exam
              </button>
            </Link>
          </div>
          <div className={styles.emptyState}>
            <FiCalendar className={styles.emptyStateIcon} />
            <p className={styles.emptyStateText}>No upcoming exams! Keep learning at your own pace.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
