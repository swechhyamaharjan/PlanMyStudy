"use client";

import { useState } from "react";
import { FiUser, FiLock, FiMoon, FiBell, FiSave, FiEye, FiEyeOff, FiSun } from "react-icons/fi";
import axios from "axios";
import styles from "./setting.module.css";

export default function SettingsPage() {
  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState({ text: "", error: false });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", error: false });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Notifications
  const [notifs, setNotifs] = useState({
    examReminders: true,
    taskReminders: true,
  });

  const handleProfileSave = async () => {
    if (!name && !email) {
      setProfileMsg({ text: "Fill in at least one field", error: true });
      return;
    }
    setProfileLoading(true);
    setProfileMsg({ text: "", error: false });
    try {
      await axios.put("/api/users/profile", { name, email });
      setProfileMsg({ text: "Profile updated successfully", error: false });
    } catch (err: any) {
      setProfileMsg({
        text: err?.response?.data?.message || "Failed to update profile",
        error: true,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ text: "Please fill in all fields", error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match", error: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Password must be at least 6 characters", error: true });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg({ text: "", error: false });
    try {
      await axios.put("/api/users/password", { currentPassword, newPassword });
      setPasswordMsg({ text: "Password changed successfully", error: false });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({
        text: err?.response?.data?.message || "Failed to change password",
        error: true,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleThemeToggle = (selected: "light" | "dark") => {
    setTheme(selected);
    document.documentElement.setAttribute("data-theme", selected);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences.</p>
      </header>

      <div className={styles.sections}>

        {/* ── Profile ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <FiUser size={18} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Profile</h2>
              <p className={styles.cardDesc}>Update your name and email address.</p>
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={styles.input}
              />
            </div>
          </div>

          {profileMsg.text && (
            <p className={`${styles.msg} ${profileMsg.error ? styles.msgError : styles.msgSuccess}`}>
              {profileMsg.text}
            </p>
          )}

          <button
            className={styles.saveBtn}
            onClick={handleProfileSave}
            disabled={profileLoading}
          >
            <FiSave size={14} />
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </section>

        {/* ── Change Password ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <FiLock size={18} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Change Password</h2>
              <p className={styles.cardDesc}>Keep your account secure with a strong password.</p>
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={styles.input}
                />
                <button className={styles.eyeBtn} onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={styles.input}
                />
                <button className={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                  {showNew ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className={styles.input}
              />
            </div>
          </div>

          {passwordMsg.text && (
            <p className={`${styles.msg} ${passwordMsg.error ? styles.msgError : styles.msgSuccess}`}>
              {passwordMsg.text}
            </p>
          )}

          <button
            className={styles.saveBtn}
            onClick={handlePasswordSave}
            disabled={passwordLoading}
          >
            <FiLock size={14} />
            {passwordLoading ? "Saving..." : "Change Password"}
          </button>
        </section>

        {/* ── Theme ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <FiMoon size={18} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Appearance</h2>
              <p className={styles.cardDesc}>Choose between light and dark mode.</p>
            </div>
          </div>

          <div className={styles.themeToggle}>
            <button
              className={`${styles.themeOption} ${theme === "light" ? styles.themeActive : ""}`}
              onClick={() => handleThemeToggle("light")}
            >
              <FiSun size={18} />
              <span>Light</span>
            </button>
            <button
              className={`${styles.themeOption} ${theme === "dark" ? styles.themeActive : ""}`}
              onClick={() => handleThemeToggle("dark")}
            >
              <FiMoon size={18} />
              <span>Dark</span>
            </button>
          </div>
        </section>

        {/* ── Notifications ── */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <FiBell size={18} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Notifications</h2>
              <p className={styles.cardDesc}>Control what reminders you receive.</p>
            </div>
          </div>

          <div className={styles.toggleList}>
            <div className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>Exam Reminders</p>
                <p className={styles.toggleDesc}>Get notified before upcoming exams</p>
              </div>
              <button
                className={`${styles.toggle} ${notifs.examReminders ? styles.toggleOn : ""}`}
                onClick={() => setNotifs({ ...notifs, examReminders: !notifs.examReminders })}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>Task Reminders</p>
                <p className={styles.toggleDesc}>Daily reminders for pending tasks</p>
              </div>
              <button
                className={`${styles.toggle} ${notifs.taskReminders ? styles.toggleOn : ""}`}
                onClick={() => setNotifs({ ...notifs, taskReminders: !notifs.taskReminders })}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}