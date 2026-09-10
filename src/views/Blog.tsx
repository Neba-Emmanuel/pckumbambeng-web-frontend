import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";

const Blog: React.FC = () => {
  const { request, data: blogs, loading, error } = useApiRequest();
  const [publishedBlogs, setPublishedBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // You can either use your main blogs endpoint and filter, or create a published-only endpoint
      const response = await request({
        method: "GET",
        url: "/blogs",
      });

      // Filter only published blogs (those with publishedAt date)
      if (response && Array.isArray(response)) {
        const published = response.filter((blog) => blog.publishedAt !== null);
        setPublishedBlogs(published);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, "");

    if (plainText.length <= maxLength) return plainText;

    return plainText.substring(0, maxLength).trim() + "...";
  };

  return (
    <>
      <Helmet>
        <title>Blog - MTMKay Technology, Consulting & Real Estate</title>
        <meta
          name="description"
          content="Read the latest articles, insights, and news from the IT world on the MTMKay blog."
        />
        <link rel="canonical" href="https://www.mtmkay.com/blog" />
      </Helmet>

      {/* Page Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MTMKay Blog</h1>
          <p className="mt-2 text-lg md:text-xl max-w-2xl mx-auto">
            Insights, trends, and tutorials from our IT experts.
          </p>
          <div className="mt-6 flex justify-center items-center text-sm md:text-base">
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2 mx-2">
              <Calendar size={16} className="mr-2" />
              <span>Latest Articles</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2 mx-2">
              <User size={16} className="mr-2" />
              <span>Expert Insights</span>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load blog posts</p>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : publishedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No blog posts published yet</p>
              <p className="text-gray-500">Check back soon for new articles!</p>
            </div>
          ) : (
            <>
              {/* Featured Post (first blog) */}
              {publishedBlogs.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Featured Article
                  </h2>
                  <Card className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={
                            publishedBlogs[0].imageUrl ||
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={publishedBlogs[0].title}
                          className="w-full h-64 md:h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      </div>
                      <div className="md:w-1/2 p-8">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(publishedBlogs[0].publishedAt)}
                          <span className="mx-2">•</span>
                          <User size={14} className="mr-2" />
                          {publishedBlogs[0].author || "MTMKay Team"}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          <Link
                            to={`/blog/${publishedBlogs[0].slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {publishedBlogs[0].title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {getExcerpt(publishedBlogs[0].content, 200)}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-2" />
                            {getReadTime(publishedBlogs[0].content)}
                          </div>
                          <Link
                            to={`/blog/${publishedBlogs[0].slug}`}
                            className="font-semibold text-primary hover:underline flex items-center"
                          >
                            Read Full Article
                            <ArrowRight size={16} className="ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* All Blog Posts */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedBlogs.slice(1).map((post) => (
                  <Card
                    key={post.id}
                    className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link to={`/blog/${post.slug}`} className="block">
                      <img
                        src={
                          post.imageUrl ||
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </Link>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(post.publishedAt)}
                        <span className="mx-2">•</span>
                        <User size={14} className="mr-2" />
                        {post.author || "MTMKay Team"}
                      </div>
                      <h2 className="text-xl font-bold mb-3 flex-grow">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="hover:text-primary transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-2" />
                          {getReadTime(post.content)}
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="font-semibold text-primary hover:underline flex items-center"
                        >
                          Read
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
