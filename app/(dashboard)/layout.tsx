import Sidebar from "@/app/components/layout/Sidebar";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.inner}>
          {children}
        </div>
      </main>
    </div>
  );
}