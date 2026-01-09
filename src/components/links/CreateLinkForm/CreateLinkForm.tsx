import { useState } from "react";
import styles from "./CreateLinkForm.module.css";
import { createShortLink } from "../../../services/linksService";

type Props = {
  onCreated?: () => void;
};

const CreateLinkForm = ({ onCreated }: Props) => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ shortUrl: string; expiresAt: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreated(null);

    const value = longUrl.trim();
    if (!value) {
      setError("Please enter a URL.");
      return;
    }
    // basic FE validation
    try {
      const u = new URL(value);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        setError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setError("Invalid URL format.");
      return;
    }

    setLoading(true);
    try {
      const res = await createShortLink(value);
      setCreated({ shortUrl: res.shortUrl, expiresAt: res.expiresAt });
      setLongUrl("");
      onCreated?.();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to create short link");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (created?.shortUrl) {
      await navigator.clipboard.writeText(created.shortUrl);
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Create a short link</h2>

      <form onSubmit={submit} className={styles.form}>
        <label className={styles.label} htmlFor="longUrl">
          Long URL
        </label>

        <div className={styles.row}>
          <input
            id="longUrl"
            className={styles.input}
            placeholder="https://example.com/some/long/path"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            disabled={loading}
          />

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Shorten"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </form>

      {created && (
        <div className={styles.result}>
          <div>
            <div className={styles.resultLabel}>Short URL</div>
            <a className={styles.resultLink} href={created.shortUrl} target="_blank" rel="noreferrer">
              {created.shortUrl}
            </a>
            <div className={styles.meta}>Expires: {new Date(created.expiresAt).toLocaleString()}</div>
          </div>

          <button className={styles.btnGhost} type="button" onClick={copy}>
            Copy
            
          </button>
        </div>
      )}
    </section>
  );
}

export default CreateLinkForm;
