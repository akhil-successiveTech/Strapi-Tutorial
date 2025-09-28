export default function Footer({ text }) {
  return (
    <footer style={{ padding: "20px", textAlign: "center", background: "#222", color: "#fff" }}>
      <p>{text}</p>
    </footer>
  );
}
