export default function BodySection({ content }) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <section style={{ padding: "50px 20px" }}>
      {content.map((block, idx) => {
        if (block.type === "paragraph") {
          return <p key={idx}>{block.children.map(c => c.text).join("")}</p>;
        }
        if (block.type === "heading") {
          return <h2 key={idx}>{block.children.map(c => c.text).join("")}</h2>;
        }
        // Add more types if needed (e.g., lists, bold, etc.)
        return null;
      })}
    </section>
  );
}
