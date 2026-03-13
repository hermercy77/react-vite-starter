import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <p className="footer__text">
        &copy; {currentYear} React Vite Starter. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
