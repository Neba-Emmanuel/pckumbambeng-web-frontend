import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Edit, Trash, PlusCircle, Calendar, User } from "lucide-react";
import { useApiRequest } from "../../hooks/useApiRequest";
import sweetAlert from "@/src/utils/alerts";
import { showConfirmationDialog } from "@/src/utils/alerts";
import BlogForm, { BlogFormData } from "../../components/admin/BlogForm";

const ManageBlog: React.FC = () => {
  const { request, data: blogs, loading, error } = useApiRequest();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    request({
      method: "GET",
      url: "/blogs",
    });
  };

  const handleAddNew = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: BlogFormData) => {
    setFormLoading(true);

    try {
      // Auto-generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);

      const payload = {
        ...formData,
        slug,
        publishedAt: formData.publishedAt || new Date().toISOString(),
      };

      const response = await request({
        method: editingBlog ? "PUT" : "POST",
        url: editingBlog ? `/blogs/${editingBlog.id}` : "/blogs",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response);

      sweetAlert({
        icon: "success",
        title: editingBlog
          ? "Blog post updated successfully"
          : "Blog post created successfully",
      });

      setShowForm(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Error:", err);
      sweetAlert({
        icon: "error",
        title: err.response?.data?.error || "Operation failed",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showConfirmationDialog(
      "Delete Blog Post?",
      "This action cannot be undone",
    );

    if (!result.isConfirmed) return;

    try {
      await request({
        method: "DELETE",
        url: `/blogs/${id}`,
      });

      sweetAlert({
        icon: "success",
        title: "Blog post deleted successfully",
      });

      fetchBlogs();
    } catch {
      sweetAlert({
        icon: "error",
        title: "Failed to delete blog post",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  return (
    <>
      <Helmet>
        <title>Manage Blog - MTMKay Admin</title>
      </Helmet>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Blog Posts
          </h1>
          <Button onClick={handleAddNew}>
            <PlusCircle size={20} className="mr-2" />
            Add New Post
          </Button>
        </div>

        <Card>
          {loading && <p className="p-4 text-gray-500">Loading blog posts…</p>}
          {error && (
            <p className="p-4 text-red-600">Failed to load blog posts</p>
          )}

          {!loading && blogs && blogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title & Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          {blog.imageUrl && (
                            <div className="flex-shrink-0">
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="h-16 w-24 rounded object-cover border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {blog.content && blog.content.substring(0, 100)}
                              {blog.content &&
                                blog.content.length > 100 &&
                                "..."}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              /{blog.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <User size={14} className="mr-2 text-gray-400" />
                          {blog.author || "Unknown"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {blog.publishedAt ? (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar
                              size={14}
                              className="mr-2 text-gray-400"
                            />
                            {formatDate(blog.publishedAt)}
                          </div>
                        ) : (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="inline-flex items-center p-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                            title="Edit blog post"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="inline-flex items-center p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete blog post"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (!blogs || blogs.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No blog posts found</p>
              <Button onClick={handleAddNew}>
                <PlusCircle size={18} className="mr-2" />
                Create Your First Blog Post
              </Button>
            </div>
          )}
        </Card>

        {showForm && (
          <BlogForm
            blog={editingBlog}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBlog(null);
            }}
            loading={formLoading}
          />
        )}
      </div>
    </>
  );
};

export default ManageBlog;
