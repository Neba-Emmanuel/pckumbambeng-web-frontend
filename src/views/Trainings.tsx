import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { ArrowRight, Search, Clock, Users, Calendar } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";

const Trainings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const { request, data: trainings, loading, error } = useApiRequest();

  const fetchTrainings = () => {
    request({
      method: "GET",
      url: "/trainings",
    });
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  console.log("Fetched Trainings:", trainings);

  // Extract unique categories from the API data
  const categories = useMemo(() => {
    if (!trainings || trainings.length === 0) return ["All"];

    const uniqueCategories = new Set<string>();
    trainings.forEach((training: any) => {
      if (training.category) {
        uniqueCategories.add(training.category);
      }
    });

    return ["All", ...Array.from(uniqueCategories)];
  }, [trainings]);

  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];

    return trainings.filter((training: any) => {
      const matchesSearch =
        training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "All" || training.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category, trainings]);

  // Calculate earliest start date from slots
  const getNextStartDate = (slots: any[]) => {
    if (!slots || slots.length === 0) return null;
    const sortedSlots = [...slots].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
    return sortedSlots[0].startDate;
  };

  // Calculate total available seats
  const getTotalSeats = (slots: any[]) => {
    if (!slots || slots.length === 0) return 0;
    return slots.reduce((total, slot) => total + (slot.availableSeats || 0), 0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Helmet>
        <title>All Trainings - MTMKay Technology, Consulting & Real Estate</title>
        <meta
          name="description"
          content="Browse our comprehensive list of IT trainings. Find the perfect course in web development, data science, cybersecurity, and more."
        />
        <link rel="canonical" href="https://www.mtmkay.com/trainings" />
      </Helmet>

      {/* Page Header */}
      <header className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Our Trainings</h1>
          <p className="mt-2 text-lg">
            Find the perfect course to launch or advance your IT career.
          </p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="py-8 bg-gray-100 sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                id="search"
                type="text"
                placeholder="Search for a training..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 pl-10 pr-4 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {/* <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select> */}
          </div>
        </div>
      </section>

      {/* Trainings Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading trainings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-red-600">
                Error Loading Trainings
              </h2>
              <p className="text-gray-600 mt-2">Please try again later.</p>
              <button
                onClick={fetchTrainings}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Retry
              </button>
            </div>
          ) : filteredTrainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainings.map((training: any) => {
                const nextStartDate = getNextStartDate(training.slots);
                const totalSeats = getTotalSeats(training.slots);

                return (
                  <Card
                    key={training.id}
                    className="h-full flex flex-col hover:shadow-lg transition-shadow"
                  >
                    {training.imageUrl ? (
                      <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                        <div className="text-primary text-center">
                          <img
                            src={training.imageUrl}
                            alt={training.title}
                            className="w-full object-cover rounded-t-lg"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                        <div className="text-primary text-center">
                          <img
                            src={"/learning.jpg"}
                            alt={"MTMKay Training"}
                            className="w-full object-cover rounded-t-lg"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-6 mt-16 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-2">
                        {training.title}
                      </h3>

                      <p className="text-gray-600 mb-4 flex-grow">
                        {training.summary || "No description available."}
                      </p>

                      {/* Training Details */}
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        {nextStartDate && (
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <span>Starts: {formatDate(nextStartDate)}</span>
                          </div>
                        )}

                        {totalSeats > 0 && (
                          <div className="flex items-center">
                            <Users size={16} className="mr-2" />
                            <span>{totalSeats} seats available</span>
                          </div>
                        )}

                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span>{training.slots?.length || 0} session(s)</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg font-bold text-primary">
                          {training.price?.toLocaleString()} XAF
                        </div>

                        <Link
                          to={`/trainings/${training.slug}`}
                          className="inline-flex items-center font-semibold text-primary hover:underline"
                        >
                          View Details <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800">
                No Trainings Found
              </h2>
              <p className="text-gray-600 mt-2">
                {trainings && trainings.length > 0
                  ? "Try adjusting your search or filter criteria."
                  : "No trainings available yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Trainings;
