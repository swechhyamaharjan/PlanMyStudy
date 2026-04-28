"use client";

import { FiPlus, FiBook, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import styles from "../EntityPage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Subject {
  id: number;
  name: string;
  difficulty: string;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function SubjectsPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("");

  async function fetchSubjects() {
    try {
      const res = await axios.get("/api/subjects");
      setSubjects(res.data);
    } catch {
      setError("Failed to load subjects");
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (!name || !difficulty) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/subjects", { name, difficulty });
      setName("");
      setDifficulty("");
      fetchSubjects();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/subjects/${id}`);
      fetchSubjects();
    } catch {
      setError("Failed to delete subject");
    }
  };

  const startEdit = (sub: Subject) => {
    setEditingId(sub.id);
    setEditName(sub.name);
    setEditDifficulty(sub.difficulty);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDifficulty("");
  };

  const handleUpdate = async (id: number) => {
    if (!editName || !editDifficulty) return;
    try {
      await axios.put(`/api/subjects/${id}`, {
        name: editName,
        difficulty: editDifficulty,
      });
      cancelEdit();
      fetchSubjects();
    } catch {
      setError("Failed to update subject");
    }
  };

  const difficultyColor = (d: string) => {
    if (d === "Easy") return styles.diffEasy;
    if (d === "Medium") return styles.diffMedium;
    if (d === "Hard") return styles.diffHard;
    return "";
  };

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subjects</h1>
          <p className={styles.subtitle}>
            Manage all the subjects you are studying this semester.
          </p>
        </div>
        <button className={styles.actionBtn}>
          <FiPlus className={styles.actionBtnIcon} /> Add Subject
        </button>
      </header>

      <div className={styles.contentArea}>
        {/* ── Form ── */}
        <div className={styles.addSubjectForm}>
          <label>Subject Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mathematics"
            className={styles.inputField}
          />

          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={styles.inputField}
          >
            <option value="">Select difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={handleAddSubject}
            className={styles.actionButton}
            disabled={loading}
          >
            <FiPlus className={styles.actionBtnIcon} />
            {loading ? "Adding..." : "Add Subject"}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        {/* ── List ── */}
        {subjects.length === 0 ? (
          <div className={styles.emptyState}>
            <FiBook className={styles.emptyStateIcon} />
            <h2 className={styles.emptyStateTitle}>No subjects yet</h2>
            <p className={styles.emptyStateDesc}>
              Get started by adding your first subject.
            </p>
          </div>
        ) : (
          <ul className={styles.subjectList}>
            {subjects.map((sub) =>
              editingId === sub.id ? (
                // ── Edit row ──
                <li key={sub.id} className={styles.editRow}>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.inputField}
                    autoFocus
                  />
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    className={styles.inputField}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className={styles.editActions}>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                      onClick={() => handleUpdate(sub.id)}
                      title="Save"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={cancelEdit}
                      title="Cancel"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </li>
              ) : (
                // ── Display row ──
                <li key={sub.id}>
                  <div className={styles.taskInfo}>
                    <span className={styles.taskTitle}>{sub.name}</span>
                    <span className={`${styles.diffBadge} ${difficultyColor(sub.difficulty)}`}>
                      {sub.difficulty}
                    </span>
                  </div>
                  <div className={styles.examMeta}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => startEdit(sub)}
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(sub.id)}
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}