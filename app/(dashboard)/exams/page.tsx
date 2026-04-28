"use client";

import { FiPlus, FiCalendar, FiTrash2 } from "react-icons/fi";
import styles from "../EntityPage.module.css";
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
  subjectId: number;
  subject: Subject;
}

export default function ExamsPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examDate, setExamDate] = useState("");
  const [subjectId, setSubjectId] = useState("");

  async function fetchExams() {
    try {
      const res = await axios.get("/api/exams");
      setExams(res.data);
    } catch {
      setError("Failed to load exams");
    }
  }

  async function fetchSubjects() {
    try {
      const res = await axios.get("/api/subjects");
      setSubjects(res.data);
    } catch {
      setError("Failed to load subjects");
    }
  }

  useEffect(() => {
    fetchExams();
    fetchSubjects();
  }, []);

  const handleAddExam = async () => {
    if (!examDate || !subjectId) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/exams", {
        examDate,
        subjectId: parseInt(subjectId),
      });

      setExamDate("");
      setSubjectId("");
      fetchExams();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add exam");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (id: number) => {
    try {
      await axios.delete(`/api/exams/${id}`);
      fetchExams();
    } catch {
      setError("Failed to delete exam");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(dateStr);
    exam.setHours(0, 0, 0, 0);
    const diff = Math.round((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Past";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `In ${diff} days`;
  };

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Exams</h1>
          <p className={styles.subtitle}>
            Keep track of your upcoming exams and deadlines.
          </p>
        </div>
        <button className={styles.actionBtn}>
          <FiPlus className={styles.actionBtnIcon} /> Schedule Exam
        </button>
      </header>

      <div className={styles.contentArea}>
        <div className={styles.addSubjectForm}>
          <label>Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className={styles.inputField}
          />

          <label>Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className={styles.inputField}
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddExam}
            className={styles.actionButton}
            disabled={loading}
          >
            <FiPlus className={styles.actionBtnIcon} />
            {loading ? "Scheduling..." : "Schedule Exam"}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        {exams.length === 0 ? (
          <div className={styles.emptyState}>
            <FiCalendar className={styles.emptyStateIcon} />
            <h2 className={styles.emptyStateTitle}>No scheduled exams</h2>
            <p className={styles.emptyStateDesc}>
              You don't have any exams coming up. Add your exam schedule here to stay prepared!
            </p>
          </div>
        ) : (
          <ul className={styles.subjectList}>
            {exams.map((exam) => {
              const daysUntil = getDaysUntil(exam.examDate);
              const isUrgent = ["Today", "Tomorrow"].includes(daysUntil);
              return (
                <li key={exam.id} className={isUrgent ? styles.urgentItem : ""}>
                  <div className={styles.examInfo}>
                    <span className={styles.examSubject}>{exam.subject.name}</span>
                    <span className={styles.examDate}>{formatDate(exam.examDate)}</span>
                  </div>
                  <div className={styles.examMeta}>
                    <span className={`${styles.examBadge} ${isUrgent ? styles.examBadgeUrgent : ""}`}>
                      {daysUntil}
                    </span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteExam(exam.id)}
                      title="Delete exam"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}