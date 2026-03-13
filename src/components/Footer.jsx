const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        &copy; {CURRENT_YEAR} React Vite Starter. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
