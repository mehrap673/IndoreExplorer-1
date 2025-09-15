import { type NewsArticle } from "@shared/schema";

const NEWS_API_KEY = process.env.NEWS_API_KEY || "demo_key";

export async function getNewsData(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=Indore&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
    );

    if (!response.ok) {
      console.error("News API error:", response.status);
      return [];
    }

    const data = await response.json();

    return (
      data.articles?.map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        author: article.author || "Unknown",
        publishedAt: article.publishedAt,
        urlToImage: article.urlToImage,
        category: "general",
        url: article.url,
      })) || []
    );
  } catch (error) {
    console.error("Failed to fetch news data:", error);
    return [];
  }
}