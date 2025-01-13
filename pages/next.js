import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next Level School</title>
        <meta name="description" content="Next Level School - Preparing students for success in exams and life!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <h1>Next Level School</h1>
        <p>Empowering students for NECO, JAMB, WAEC, SAT, IELTS, and more!</p>
      </header>

      <nav className="navbar">
        <a href="#about">About Us</a>
        <a href="#blog">Blog/News</a>
        <a href="#contact">Contact Us</a>
      </nav>

      <main className="content">
        <section id="about" className="about">
          <h2>About Us</h2>
          <p>
            Next Level School is dedicated to preparing students for academic excellence
            and success in exams like NECO, JAMB, WAEC, SAT, IELTS, JUPEB, IJMB, and more.
          </p>
          <Image src="/about.jpg" alt="Students learning" width={800} height={400} />
        </section>

        <section id="blog" className="blog">
          <h2>Blog/News</h2>
          <article>
            <h3>New Session Starts Soon!</h3>
            <p>Our new session begins on February 1st. Enroll now!</p>
          </article>
          <article>
            <h3>Exciting Updates!</h3>
            <p>We have added TOEFL and TORFL prep to our curriculum!</p>
          </article>
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <form>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <label>
              Message:
              <textarea name="message" required></textarea>
            </label>
            <button type="submit">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Next Level School. All rights reserved.</p>
      </footer>
    </div>
  );
}