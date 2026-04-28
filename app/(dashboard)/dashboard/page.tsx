"use client";

import { FiBook, FiCalendar, FiCheckSquare, FiPlus, FiSquare, FiTrash2 } from "react-icons/fi";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

interface Subject {
  id: number;
  name: string;
  difficulty: string;
}

interface Exam {
  id: number;
  examDate: string;
  subject: Subject;
}

interface StudyTask {
  id: number;
  title: string;
  taskDate: string;
  completed: boolean;
  subjectId: number;
  subject: Subject;
}

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);

  useEffect(() => {
    axios.get("/api/subjects").then((r) => setSubjects(r.data)).catch(() => {});
    axios.get("/api/exams").then((r) => setExams(r.data)).catch(() => {});
    // Change to your actual study tasks route if different
    axios.get("/api/study-tasks").then((r) => setTasks(r.data)).catch(() => {});
  }, []);

  // Today's tasks
  const todayStr = new Date().toDateString();
  const todayTasks = tasks.filter(
    (t) => new Date(t.taskDate).toDateString() === todayStr && !t.completed
  );

  // Upcoming exams — future dates sorted soonest first, max 4
  const upcomingExams = exams
    .filter((e) => new Date(e.examDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 4);

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(dateStr);
    exam.setHours(0, 0, 0, 0);
    const diff = Math.round((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `In ${diff}d`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const handleToggleTask = async (task: StudyTask) => {
    try {
      await axios.put(`/api/study-tasks/${task.id}`, {
        completed: !task.completed,
        title: task.title,
        taskDate: task.taskDate,
        subjectId: task.subjectId,
      });
      const res = await axios.get("/api/study-tasks");
      setTasks(res.data);
    } catch {}
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here's an overview of your study plan.</p>
      </header>

      {/* Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiBook />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Subjects</span>
            <span className={styles.metricValue}>{subjects.length}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiCalendar />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Upcoming Exams</span>
            <span className={styles.metricValue}>{upcomingExams.length}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper}>
            <FiCheckSquare />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Pending Tasks</span>
            <span className={styles.metricValue}>{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Today's Tasks</h2>
            <Link href="/tasks">
              <button className={styles.actionBtn}>
                <FiPlus className="inline mr-1" /> New Task
              </button>
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <FiCheckSquare className={styles.emptyStateIcon} />
              <p className={styles.emptyStateText}>
                No tasks for today! Enjoy your free time or get ahead on studying.
              </p>
            </div>
          ) : (
            <ul className={styles.taskList}>
              {todayTasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <button
                    className={styles.checkBtn}
                    onClick={() => handleToggleTask(task)}
                    title="Mark complete"
                  >
                    <FiSquare size={15} />
                  </button>
                  <div className={styles.taskInfo}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={styles.taskMeta}>{task.subject.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming Exams */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Exams</h2>
            <Link href="/exams">
              <button className={styles.actionBtn}>
                <FiPlus className="inline mr-1" /> New Exam
              </button>
            </Link>
          </div>

          {upcomingExams.length === 0 ? (
            <div className={styles.emptyState}>
              <FiCalendar className={styles.emptyStateIcon} />
              <p className={styles.emptyStateText}>
                No upcoming exams! Keep learning at your own pace.
              </p>
            </div>
          ) : (
            <ul className={styles.taskList}>
              {upcomingExams.map((exam) => {
                const daysUntil = getDaysUntil(exam.examDate);
                const isUrgent = ["Today", "Tomorrow"].includes(daysUntil);
                return (
                  <li key={exam.id} className={styles.taskItem}>
                    <div className={styles.examDot} />
                    <div className={styles.taskInfo}>
                      <span className={styles.taskTitle}>{exam.subject.name}</span>
                      <span className={styles.taskMeta}>{formatDate(exam.examDate)}</span>
                    </div>
                    <span className={`${styles.examBadge} ${isUrgent ? styles.examBadgeUrgent : ""}`}>
                      {daysUntil}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}