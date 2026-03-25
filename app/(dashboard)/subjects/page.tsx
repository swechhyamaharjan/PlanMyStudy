"use client";

import { FiPlus, FiBook } from "react-icons/fi";
import styles from "../EntityPage.module.css";

export default function SubjectsPage() {
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subjects</h1>
          <p className={styles.subtitle}>Manage all the subjects you are studying this semester.</p>
        </div>
        <button className={styles.actionBtn}>
          <FiPlus className={styles.actionBtnIcon} /> Add Subject
        </button>
      </header>

      <div className={styles.contentArea}>
        <div className={styles.emptyState}>
          <FiBook className={styles.emptyStateIcon} />
          <h2 className={styles.emptyStateTitle}>No subjects yet</h2>
          <p className={styles.emptyStateDesc}>
            Get started by adding your first subject. You can associate tasks and exams to specific subjects later.
          </p>
        </div>
      </div>
    </div>
  );
}
