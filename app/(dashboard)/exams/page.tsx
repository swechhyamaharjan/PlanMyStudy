"use client";

import { FiPlus, FiCalendar } from "react-icons/fi";
import styles from "../EntityPage.module.css";

export default function ExamsPage() {
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Exams</h1>
          <p className={styles.subtitle}>Keep track of your upcoming exams and deadlines.</p>
        </div>
        <button className={styles.actionBtn}>
          <FiPlus className={styles.actionBtnIcon} /> Schedule Exam
        </button>
      </header>

      <div className={styles.contentArea}>
        <div className={styles.emptyState}>
          <FiCalendar className={styles.emptyStateIcon} />
          <h2 className={styles.emptyStateTitle}>No scheduled exams</h2>
          <p className={styles.emptyStateDesc}>
            You don't have any exams coming up. Add your exam schedule here to stay prepared!
          </p>
        </div>
      </div>
    </div>
  );
}
