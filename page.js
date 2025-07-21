import Image from "next/image";
import styles from "./page.module.css";
import RecurrentDatePicker from "./components/RecurrentDatePicker";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ marginTop: "2rem", width: "100%" }}>
          <RecurrentDatePicker />
        </div>

      </main>

      <footer className={styles.footer}>
        {/* ...footer content remains the same... */}
      </footer>
    </div>
  );
}
