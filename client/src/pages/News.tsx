import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { NewsArticle } from '@shared/schema';
import Layout from '@/components/Layout';

const categories = ['all', 'city', 'culture', 'travel', 'development'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: articles = [], isLoading, error } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  const formatDate = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - publishedDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffHours < 48) {
      return '1 day ago';
    } else {
      return `${Math.floor(diffHours / 24)} days ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'city': 'bg-blue-500/20 text-blue-400',
      'culture': 'bg-purple-500/20 text-purple-400',
      'travel': 'bg-green-500/20 text-green-400',
      'development': 'bg-orange-500/20 text-orange-400',
      'general': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors.general;
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  if (isLoading) {
    return (
      <Layout title="Latest News - Indore">
        <div className="py-20 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading latest news...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Latest News - Indore Updates & Headlines"
      description="Stay updated with the latest news from Indore. Get current information about city developments, culture, travel, and local events."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Latest News</h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with the latest happenings in and around Indore
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
                data-testid={`filter-${category}`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {error && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive">Unable to load news. Please try again later.</p>
              </div>
            </motion.div>
          )}

          {/* News Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  data-testid={`article-${index}`}
                >
                  {article.urlToImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span data-testid={`article-author-${index}`}>{article.author}</span>
                      <span>•</span>
                      <span data-testid={`article-date-${index}`}>{formatDate(article.publishedAt)}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2" data-testid={`article-title-${index}`}>
                      {article.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`article-description-${index}`}>
                      {article.description}
                    </p>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                      data-testid={`article-link-${index}`}
                    >
                      Read Full Article
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </motion.article>
              ))
            ) : (
              !isLoading && (
                <motion.div
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    {selectedCategory === 'all' 
                      ? 'No news articles available at the moment.'
                      : `No articles found in the "${selectedCategory}" category.`
                    }
                  </p>
                </motion.div>
              )
            )}
          </div>

          {/* News Sources Info */}
          <motion.div
            className="mt-16 text-center bg-secondary p-8 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our news section aggregates the latest updates about Indore from reliable sources. 
              We cover city developments, cultural events, tourism updates, and other important local news.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}