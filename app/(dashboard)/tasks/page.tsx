"use client";

import { FiPlus, FiCheckSquare } from "react-icons/fi";
import styles from "../EntityPage.module.css";

export default function TasksPage() {
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tasks</h1>
          <p className={styles.subtitle}>Your daily to-do list and study sessions.</p>
        </div>
        <button className={styles.actionBtn}>
          <FiPlus className={styles.actionBtnIcon} /> Create Task
        </button>
      </header>

      <div className={styles.contentArea}>
        <div className={styles.emptyState}>
          <FiCheckSquare className={styles.emptyStateIcon} />
          <h2 className={styles.emptyStateTitle}>All caught up!</h2>
          <p className={styles.emptyStateDesc}>
            You have no pending tasks. Add new study goals or take a break.
          </p>
        </div>
      </div>
    </div>
  );
}
