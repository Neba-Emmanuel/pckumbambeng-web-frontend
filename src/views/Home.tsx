import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  ArrowRight,
  Star,
  Users,
  Briefcase,
  BarChart,
  Coffee,
  Wifi,
  Zap,
  Clock,
  Calendar,
  ChevronRight,
  FileText,
} from "lucide-react";
import { servicesData } from "../data/services";
import { useApiRequest } from "../hooks/useApiRequest";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  // Use the custom hook for trainings
  const {
    request: fetchTrainingsApi,
    data: trainingsData,
    loading: trainingsLoading,
    error: trainingsError,
  } = useApiRequest<any[]>();

  // Use the custom hook for blogs
  const {
    request: fetchBlogsApi,
    data: blogsData,
    loading: blogsLoading,
    error: blogsError,
  } = useApiRequest<any[]>();

  const [trainings, setTrainings] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchTrainings();
    fetchBlogs();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await fetchTrainingsApi({
        method: "GET",
        url: "/trainings",
      });

      // Ensure we have an array
      const trainingsArray = Array.isArray(data) ? data : [];
      setTrainings(trainingsArray);
    } catch (err) {
      console.error("Failed to fetch trainings:", err);
      setTrainings([]);
    }
  };

  const fetchBlogs = async () => {
    try {
      const data = await fetchBlogsApi({
        method: "GET",
        url: "/blogs",
      });

      // Ensure we have an array and filter only published blogs
      const blogsArray = Array.isArray(data) ? data : [];
      const publishedBlogs = blogsArray.filter(
        (blog) => blog.publishedAt !== null,
      );
      setBlogs(publishedBlogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    }
  };

  const featuredCourses = trainings.slice(0, 3);
  const latestPosts = blogs.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  // Shimmer loading component for training cards
  const TrainingCardShimmer = () => (
    <Card className="h-full flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>
      </div>
    </Card>
  );

  // Shimmer loading component for blog cards
  const BlogCardShimmer = () => (
    <Card className="animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>MTMKay Technology, Consulting & Real Estate - Home</title>
        <meta
          name="description"
          content="Welcome to MTMKay, a leading center for IT training and consultancy. Explore our Work Café, courses in web development, data science, and more."
        />
        <link rel="canonical" href="https://www.mtmkay.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-gray-600 text-white pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/hero.jpeg')`,
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Unlock Your Future in Tech.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Your gateway to a thriving career in IT. MTMKay offers
              comprehensive IT consulting, cybersecurity, certification
              training, and a professional workspace at our Work Café.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asLink to="/trainings" size="lg" variant="secondary">
                Explore Trainings
              </Button>
              <Button
                asLink
                to="/work-cafe"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-primary-dark"
              >
                Visit Work Café
              </Button>
              <Button
                asLink
                to="/capabilities-statement"
                size="lg"
                variant="outline"
                className="border-amber-400 text-white hover:bg-white-400/10"
              >
                Government Contracting
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Café Highlight Section - NEW */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
                <Coffee size={16} className="text-amber-700" />
                <span className="text-amber-700 font-semibold text-sm">
                  NEW
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Introducing Work Café
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                A quiet, professional workspace with reliable internet and
                power—ideal for focused work, online learning, and remote jobs.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Wifi size={18} className="text-primary" />
                  <span className="text-sm">100Mbps Starlink</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-primary" />
                  <span className="text-sm">Power backup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm">Flexible hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span className="text-sm">Monthly plans</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asLink to="/work-cafe" variant="primary">
                  Learn More About Work Café
                </Button>
                <Button
                  onClick={() =>
                    navigate("/contact", {
                      state: {
                        source: "work-cafe",
                        plan: { name: "General Inquiry" },
                      },
                    })
                  }
                  variant="outline"
                >
                  Book Your Spot
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-amber-200"
            >
              <h3 className="text-xl font-bold mb-4">Flexible Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Hourly</span>
                  <span className="font-bold">500 FCFA</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Daily</span>
                  <span className="font-bold">2,000 FCFA</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Weekly</span>
                  <span className="font-bold">10,000 FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Monthly</span>
                  <span className="font-bold text-primary">30,000 FCFA</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Best Value
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Why Choose MTMKay?</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            We are committed to providing the best learning experience,
            professional workspace, and tangible results for your career and
            business.
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: Star,
                title: "Expert Instructors",
                text: "Learn from industry veterans with real-world experience.",
              },
              {
                icon: Coffee,
                title: "Work Café Access",
                text: "Professional workspace with high-speed internet and power backup.",
              },
              {
                icon: Users,
                title: "Career Support",
                text: "Guidance on resumes, interviews, and job placements.",
              },
              {
                icon: BarChart,
                title: "Proven Results",
                text: "Join our alumni who now work at top tech companies.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-8 h-full">
                  <div className="flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-full mx-auto mb-4">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Work Café + Learning Integration */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-blue-50 p-8 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                  <Coffee size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Work + Learn</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Combine your workspace needs with professional development.
                <span className="font-semibold">
                  {" "}
                  Work Café subscribers get 10% off all IT training programs.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asLink to="/work-cafe" variant="outline" size="sm">
                  Explore Work Café
                </Button>
                <Button asLink to="/trainings" variant="outline" size="sm">
                  View Trainings
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200"
            >
              <h3 className="text-2xl font-bold mb-2">Student Special</h3>
              <p className="text-gray-700 mb-4">
                Valid student ID? Get{" "}
                <span className="font-bold text-primary">20% off</span> monthly
                Work Café subscriptions.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-white px-3 py-1 rounded-full">
                  Valid ID required
                </span>
                <span className="bg-white px-3 py-1 rounded-full">
                  Limited offer
                </span>
              </div>
              <Link
                to="/work-cafe"
                className="font-semibold text-primary hover:underline inline-flex items-center"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Featured Trainings</h2>
            <p className="text-lg text-gray-600">
              Start your learning journey with our most popular courses.
            </p>
          </div>

          {trainingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <TrainingCardShimmer key={i} />
              ))}
            </div>
          ) : trainingsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{trainingsError}</p>
              <Button onClick={fetchTrainings} variant="outline">
                Try Again
              </Button>
            </div>
          ) : trainings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No trainings available yet.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h3 className="text-xl font-bold">{course.title}</h3>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {course.category || "IT Training"}
                        </span>
                        {course.price && course.price > 0 && (
                          <span className="text-sm font-bold text-gray-800">
                            {course.price.toLocaleString()} XAF
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-gray-600 flex-grow line-clamp-3">
                        {course.summary || "No description available."}
                      </p>
                      <Link
                        to={`/trainings/${course.slug}`}
                        className="mt-4 inline-flex items-center font-semibold text-primary hover:underline"
                      >
                        Learn More <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Button asLink to="/trainings" variant="secondary" size="lg">
              View All Trainings
            </Button>
          </div>
        </div>
      </section>

      {/* Services Highlight Section */}
      <section className="py-20 bg-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">IT Consultancy Services</h2>
            <p className="text-lg text-gray-300">
              Driving business growth with strategic technology solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="text-center p-6 bg-primary rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-16 w-16 bg-white/10 text-white rounded-full mx-auto mb-4">
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Contracting Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-blue-50 p-8 md:p-12 rounded-2xl border border-primary/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText size={48} className="text-primary" />
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Government Contracting
                  </h2>
                  <p className="text-gray-600 mb-4">
                    MTMKay is a Service-Disabled Veteran-Owned Small Business (SDVOSB) 
                    providing secure, reliable IT and cybersecurity solutions for federal 
                    and commercial clients.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button asLink to="/capabilities-statement" variant="primary">
                      View Capabilities Statement
                    </Button>
                    <Button
                      asLink
                      to="/contact"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5"
                    >
                      Contact Government POC
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Work Café CTA Banner */}
      {/* <section className="py-16 bg-amber-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <Coffee size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Quiet Place to Work or Study?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Visit our Work Café today. High-speed internet, reliable power,
              and a professional environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asLink
                to="/work-cafe"
                size="lg"
                variant="secondary"
                className="bg-white text-amber-700 hover:bg-gray-100"
              >
                Learn More About Work Café
              </Button>
              <Button
                asLink
                to="/contact"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Book Your Spot
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Starting at just 500 FCFA/hour • Monthly subscriptions from 30,000
              FCFA
            </p>
          </motion.div>
        </div>
      </section> */}

      {/* Blog Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">From Our Blog</h2>
            <p className="text-lg text-gray-600">
              Insights, trends, and news from the world of IT.
            </p>
          </div>

          {blogsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <BlogCardShimmer key={i} />
              ))}
            </div>
          ) : blogsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{blogsError}</p>
              <Button onClick={fetchBlogs} variant="outline">
                Try Again
              </Button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <h3 className="text-lg font-bold">{post.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      {post.author && (
                        <>
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      {post.publishedAt && (
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content
                        ? post.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 150) + "..."
                        : "No content available."}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-semibold text-primary hover:underline inline-flex items-center"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {blogs.length > 3 && (
            <div className="text-center mt-12">
              <Button asLink to="/blog" variant="outline" size="lg">
                Read All Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you need professional training, IT consulting, or a
              workspace to focus, we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asLink to="/contact" size="lg" variant="primary">
                Get in Touch
              </Button>
              <Button
                asLink
                to="/work-cafe"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Visit Work Café
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
