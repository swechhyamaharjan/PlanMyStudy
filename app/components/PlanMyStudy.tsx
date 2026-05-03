"use client";

import { useState } from "react";
import axios from "axios";
import { FiZap } from "react-icons/fi";
import styles from "./PlanMyStudy.module.css";

interface Props {
  onPlanGenerated: () => void; // callback to refresh tasks after plan is created
}

export default function PlanMyStudy({ onPlanGenerated }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await axios.post("/api/ai/plan");
      setStatus("success");
      setMessage(res.data.message);
      onPlanGenerated();
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.iconWrap}>
            <FiZap size={22} />
          </div>
          <div>
            <h3 className={styles.cardTitle}>AI Study Planner</h3>
            <p className={styles.cardDesc}>
              Automatically generate a personalized study schedule based on your subjects and exam dates.
            </p>
          </div>
        </div>

        <button
          className={`${styles.btn} ${status === "loading" ? styles.btnLoading : ""}`}
          onClick={handleGenerate}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className={styles.spinner} />
              Generating...
            </>
          ) : (
            <>
              <FiZap size={15} />
              Generate Plan
            </>
          )}
        </button>
      </div>

      {message && (
        <p className={`${styles.feedback} ${status === "error" ? styles.feedbackError : styles.feedbackSuccess}`}>
          {message}
        </p>
      )}
    </div>
  );
}