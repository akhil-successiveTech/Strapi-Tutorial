import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleList from "@/components/ArticleList";

async function getArticles() {
  try {
    const res = await fetch("http://localhost:1337/api/articles?populate=*", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch articles");

    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <Navbar />
      <main style={{ padding: "50px 20px" }}>
        <h1>Latest Articles</h1>
        <ArticleList articles={articles} />
      </main>
      <Footer />
    </>
  );
}
