"use client";

import { FiPlus, FiCheckSquare, FiSquare, FiTrash2 } from "react-icons/fi";
import styles from "../EntityPage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Subject {
  id: number;
  name: string;
  difficulty: string;
}

interface StudyTask {
  id: number;
  title: string;
  taskDate: string;
  completed: boolean;
  subjectId: number;
  subject: Subject;
}

export default function TasksPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [title, setTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [subjectId, setSubjectId] = useState("");

  async function fetchTasks() {
  try {
    const res = await axios.get("/api/studyTasks");
    setTasks(res.data);
  } catch (err: any) {
    console.log(err?.response?.status, err?.response?.data);
    setError(err?.response?.data?.message || "Failed to load tasks");
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
    fetchTasks();
    fetchSubjects();
  }, []);

  const handleAddTask = async () => {
    if (!title || !taskDate || !subjectId) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/studyTasks", {
        title,
        taskDate,
        subjectId: parseInt(subjectId),
        completed: false,
      });

      setTitle("");
      setTaskDate("");
      setSubjectId("");
      fetchTasks();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: StudyTask) => {
    try {
      await axios.put(`/api/studyTasks/${task.id}`, {
        completed: !task.completed,
        title: task.title,
        taskDate: task.taskDate,
        subjectId: task.subjectId,
      });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`/api/studyTasks/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

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
        {/* ── Form ── */}
        <div className={styles.addSubjectForm}>
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Review Chapter 4"
            className={styles.inputField}
          />

          <label>Due Date</label>
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
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
            onClick={handleAddTask}
            className={styles.actionButton}
            disabled={loading}
          >
            <FiPlus className={styles.actionBtnIcon} />
            {loading ? "Adding..." : "Add Task"}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        {/* ── List ── */}
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <FiCheckSquare className={styles.emptyStateIcon} />
            <h2 className={styles.emptyStateTitle}>All caught up!</h2>
            <p className={styles.emptyStateDesc}>
              You have no pending tasks. Add new study goals or take a break.
            </p>
          </div>
        ) : (
          <div className={styles.taskListWrapper}>
            {pending.length > 0 && (
              <section>
                <p className={styles.taskGroupLabel}>Pending · {pending.length}</p>
                <ul className={styles.subjectList}>
                  {pending.map((task) => (
                    <li key={task.id}>
                      <button
                        className={styles.checkBtn}
                        onClick={() => handleToggleComplete(task)}
                        title="Mark complete"
                      >
                        <FiSquare size={16} />
                      </button>
                      <div className={styles.taskInfo}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <span className={styles.taskMeta}>
                          {task.subject.name} · {formatDate(task.taskDate)}
                        </span>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <p className={styles.taskGroupLabel}>Completed · {completed.length}</p>
                <ul className={styles.subjectList}>
                  {completed.map((task) => (
                    <li key={task.id} className={styles.completedItem}>
                      <button
                        className={`${styles.checkBtn} ${styles.checkBtnDone}`}
                        onClick={() => handleToggleComplete(task)}
                        title="Mark incomplete"
                      >
                        <FiCheckSquare size={16} />
                      </button>
                      <div className={styles.taskInfo}>
                        <span className={`${styles.taskTitle} ${styles.taskTitleDone}`}>
                          {task.title}
                        </span>
                        <span className={styles.taskMeta}>
                          {task.subject.name} · {formatDate(task.taskDate)}
                        </span>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}