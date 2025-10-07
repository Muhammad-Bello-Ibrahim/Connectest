import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";

const NotFoundPage: React.FC = () => (
    <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>
            Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className={styles.homeLink}>
            Go Home
        </Link>
    </div>
);

export default NotFoundPage;