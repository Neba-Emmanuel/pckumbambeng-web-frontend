import { uploadImage } from "../../utils/uploadImage";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import {
  X,
  Info,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react";

interface BlogFormProps {
  blog?: any;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  author: string;
  imageUrl?: string | null;
  publishedAt?: string | null;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blog,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: blog?.title || "",
    slug: blog?.slug || "",
    content: blog?.content || "",
    author: blog?.author || "",
    imageUrl: blog?.imageUrl || null,
    publishedAt: blog?.publishedAt || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({ ...prev, content: html }));

      // Clear content error if any
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: "" }));
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Update editor content when blog data changes
  useEffect(() => {
    if (editor && blog?.content) {
      editor.commands.setContent(blog.content);
    }
  }, [editor, blog]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim() || formData.content === "<p></p>") {
      newErrors.content = "Content is required";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Auto-generate slug from title when title changes
    if (name === "title" && !blog?.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageUrl: value || null,
    }));

    if (errors.imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImage(file, "blog");
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    if (!validate()) return;

    try {
      console.log("🚀 Blog form data being submitted:", formData);
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
      alert("Failed to save blog post. Please try again.");
    }
  };

  const getImagePreviewUrl = () => {
    if (!formData.imageUrl) return null;
    try {
      new URL(formData.imageUrl);
      return formData.imageUrl;
    } catch {
      return null;
    }
  };

  const imagePreview = getImagePreviewUrl();

  // Editor toolbar buttons
  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 bg-gray-50 rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-300" : ""}`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-300" : ""}`}
          title="Code Block"
        >
          <Code size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-5xl my-8">
        <Card className="relative p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {blog ? "Edit Blog Post" : "Add New Blog Post"}
              </h2>
              <p className="text-gray-600 mt-1">
                Fill in the details below to create a new blog post
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info
                    className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                    size={20}
                  />
                  <p className="text-blue-700 text-sm">
                    All fields except image are required for a blog post.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.title
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Enter blog post title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                      placeholder="auto-generated-slug"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    URL-friendly version of the title. Auto-generated from
                    title.
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.author
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Author name"
                  />
                  {errors.author && (
                    <p className="mt-2 text-sm text-red-600">{errors.author}</p>
                  )}
                </div>

                {/* Published Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Date
                  </label>
                  <input
                    type="datetime-local"
                    name="publishedAt"
                    value={formData.publishedAt || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Leave empty for draft, set date to publish
                  </p>
                </div>

                {/* Blog Image URL */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>

                  <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload image (JPEG, PNG, WebP, GIF; up to 4 MB)
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleFileUpload} disabled={loading || uploading}
                          className="block w-full mt-2 text-sm" />
                      </label>
                      {uploading && <p role="status">Uploading image…</p>}
                      {uploadError && <p role="alert" className="text-sm text-red-600">{uploadError}</p>}

                    {imagePreview ? (
                      <>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-32 w-48 rounded-lg object-cover border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="url"
                                value={formData.imageUrl || ""}
                                onChange={handleImageUrlChange}
                                disabled={uploading}
                                placeholder="https://example.com/image.jpg"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors.imageUrl
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              />
                              {errors.imageUrl && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.imageUrl}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="text-red-600 border-red-300"
                              onClick={removeImage}
                                disabled={uploading}
                            >
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="text-gray-600 mb-4">
                            Add a featured image for your blog post (optional)
                          </p>
                          <input
                            type="url"
                            value={formData.imageUrl || ""}
                            onChange={handleImageUrlChange}
                                disabled={uploading}
                            placeholder="https://example.com/image.jpg"
                            className={`w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                              errors.imageUrl
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          />
                          {errors.imageUrl && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.imageUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Enter the full URL of your blog featured image
                  </p>
                </div>

                {/* Content - WYSIWYG Editor */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>

                  <div
                    className={`border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all ${
                      errors.content
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <MenuBar />
                    <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
                      <EditorContent editor={editor} />
                    </div>
                  </div>

                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.content}
                    </p>
                  )}

                  <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
                    <span>Use the toolbar above to format your content</span>
                    <span className="text-gray-400">•</span>
                    <span>
                      Supports: Bold, Italic, Headings, Lists, Quotes, Code
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading || uploading}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading || uploading}>
                  {blog ? "Update Blog Post" : "Create Blog Post"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BlogForm;
