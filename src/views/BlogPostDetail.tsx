import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { request: fetchBlog, data: blog, loading, error } = useApiRequest();

  const { request: fetchBlogs } = useApiRequest();

  const blogData = blog;
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const blogResponse = await fetchBlog({
        method: "GET",
        url: `/blogs/${slug}`,
      });

      const allBlogs = await fetchBlogs({
        method: "GET",
        url: "/blogs",
      });

      if (allBlogs && Array.isArray(allBlogs)) {
        const otherBlogs = allBlogs
          .filter((b) => b.slug !== slug && b.publishedAt !== null)
          .slice(0, 3);

        setRelatedBlogs(otherBlogs);
      }
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    if (!content) return "0 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getDescription = (content: string) => {
    if (!content) return "Read this blog post on MTMKay";
    const plainText = content.replace(/<[^>]*>/g, "");
    if (plainText.length <= 160) return plainText;
    return plainText.substring(0, 160) + "...";
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(blogData?.title || "");
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Safety checks for blog data
  const blogTitle = blogData?.title || "Blog Post";
  const blogContent = blogData?.content || "";
  const blogImageUrl = blogData?.imageUrl || "";
  const blogSlug = blogData?.slug || "";
  const blogAuthor = blogData?.author || "MTMKay Team";
  const blogPublishedAt = blogData?.publishedAt || "";

  return (
    <>
      <Helmet>
        <title>{blogTitle} - MTMKay Blog</title>
        <meta name="description" content={getDescription(blogContent)} />
        <meta property="og:title" content={blogTitle} />
        <meta property="og:description" content={getDescription(blogContent)} />
        {blogImageUrl && <meta property="og:image" content={blogImageUrl} />}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://www.mtmkay.com/blog/${blogSlug}`}
        />
        <link
          rel="canonical"
          href={`https://www.mtmkay.com/blog/${blogSlug}`}
        />
      </Helmet>

      <article className="min-h-screen bg-white">
        {/* Blog Header */}
        <header className="relative py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <Link
              to="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>

            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {blogTitle}
              </h1>

              <div className="flex flex-wrap justify-center items-center text-sm md:text-base gap-4 mb-6">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{blogAuthor}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{formatDate(blogPublishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{getReadTime(blogContent)}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {blogImageUrl && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={blogImageUrl}
                  alt={blogTitle}
                  className="w-full h-auto max-h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b">
              <div className="flex items-center text-gray-600">
                <Share2 size={20} className="mr-2" />
                <span className="font-medium">Share this article:</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={shareOnFacebook}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={20} />
                </button>
              </div>
            </div>

            {/* Blog Content */}
            {blogContent && (
              <div
                className="prose prose-lg max-w-none mb-12
                [&_p]:mb-4
                [&_ul]:list-disc
                [&_ul]:pl-6
                [&_ol]:list-decimal
                [&_ol]:pl-6"
                dangerouslySetInnerHTML={{ __html: blogContent }}
              />
            )}

            {/* Author Bio */}
            <Card className="mb-12">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {blogAuthor}
                    </h4>
                    <p className="text-gray-600 mt-2">
                      Expert in IT training and consultancy with years of
                      experience in the industry.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Card
                      key={relatedBlog.id}
                      className="hover:shadow-lg transition-shadow duration-300"
                    >
                      <Link to={`/blog/${relatedBlog.slug}`}>
                        {relatedBlog.imageUrl && (
                          <img
                            src={relatedBlog.imageUrl}
                            alt={relatedBlog.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(relatedBlog.publishedAt)}
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostDetail;
