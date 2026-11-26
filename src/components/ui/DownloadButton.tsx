/**
 * DownloadButton: the angled download button of the live home page.
 * Visual details are in DownloadButton.module.css.
 */
import styles from "./DownloadButton.module.css";

interface DownloadButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export default function DownloadButton({
  label = "下载 3.0 客户端",
  href = "#",
  className = "",
}: DownloadButtonProps) {
  return (
    <a href={href} className={`${styles.button} ${className}`}>
      <span className={styles.inner}>
        <i className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </span>
    </a>
  );
}
