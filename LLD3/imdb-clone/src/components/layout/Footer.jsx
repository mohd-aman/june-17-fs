function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500 text-center py-6 mt-auto">
      <p>
        &copy; {new Date().getFullYear()} IMDb Clone. Built with React and TMDB
        API.
      </p>
    </footer>
  );
}
export default Footer;