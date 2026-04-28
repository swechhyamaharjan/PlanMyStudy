"use client";

import { FiPlus, FiBook } from "react-icons/fi";
import styles from "../EntityPage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Subject {
  id: number;
  name: string;
  difficulty: string;
}

export default function SubjectsPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");

  async function fetchSubjects() {
    try {
      const res = await axios.get("/api/subjects");
      setSubjects(res.data);
    } catch (err) {
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
      await axios.post("/api/subjects", {
        name,
        difficulty,
      });

      setName("");
      setDifficulty("");
      fetchSubjects();
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
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
        <div className={styles.addSubjectForm}>
          <label>Subject Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subject Name"
            className={styles.inputField}
          />

          <label>Difficulty</label>
          <input
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            placeholder="Easy, Medium, Hard"
            className={styles.inputField}
          />

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
            {subjects.map((sub) => (
              <li key={sub.id}>
                {sub.name} - {sub.difficulty}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}