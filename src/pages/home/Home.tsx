import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { getToken } from "../../utils/token";

const Home = () => {
  const authed = Boolean(getToken());

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Shorten URLs. <span>Share smarter.</span>
          </h1>

          <p className={styles.subtitle}>
            Create clean, short, and reliable links with built-in security and
            fast redirects.
          </p>

          <div className={styles.ctaGroup}>
            {authed ? (
              <Link to="/links" className={styles.primaryBtn}>
                View My Links
              </Link>
            ) : (
              <>
                <Link to="/register" className={styles.primaryBtn}>
                  Get Started
                </Link>
                <Link to="/login" className={styles.secondaryBtn}>
                  Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h3>⚡ Fast</h3>
            <p>
              Redis-backed redirects ensure your links open instantly,
              everywhere.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>🔒 Secure</h3>
            <p>
              JWT authentication keeps your links private and tied to your
              account.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>📊 Reliable</h3>
            <p>
              Deterministic short codes with persistence — no collisions, no
              surprises.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
