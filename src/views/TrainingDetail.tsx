import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NotFound from "./NotFound";
import Button from "../components/ui/Button";
import Accordion from "../components/ui/Accordion";
import {
  Target,
  UserCheck,
  BookOpen,
  Briefcase,
  Box,
  Calendar,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";

interface TrainingSlot {
  id: number;
  startDate: string;
  endDate: string;
  schedule: string;
  seats: number;
  availableSeats: number;
}

interface Training {
  id: number;
  title: string;
  slug: string;
  summary: string;
  objectives: string;
  eligibility: string;
  outline: string;
  resources: string;
  price: number;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  slots: TrainingSlot[];
}

const TrainingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request, data: training, loading, error } = useApiRequest<Training>();
  const [courseOutlineItems, setCourseOutlineItems] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      request({
        method: "GET",
        url: `/trainings/${id}`,
      });
    }
  }, [id]);

  useEffect(() => {
    if (training?.outline) {
      // Parse the outline text into structured modules
      const modules = parseOutline(training.outline);
      setCourseOutlineItems(modules);
    }
  }, [training?.outline]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (error || !training) {
    return <NotFound />;
  }

  // Helper function to parse the outline text into modules
  function parseOutline(
    outlineText: string,
  ): Array<{ id: string; title: string; content: React.ReactNode }> {
    const lines = outlineText.split("\n");
    const modules: Array<{ id: string; title: string; content: string[] }> = [];
    let currentModule: { id: string; title: string; content: string[] } | null =
      null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (
        trimmedLine.toLowerCase().startsWith("module") ||
        trimmedLine.toLowerCase().includes("week") ||
        trimmedLine.toLowerCase().includes("part")
      ) {
        if (currentModule) {
          modules.push(currentModule);
        }
        currentModule = {
          id: `module-${modules.length + 1}`,
          title: trimmedLine,
          content: [],
        };
      } else if (
        currentModule &&
        (trimmedLine.startsWith("-") || trimmedLine.startsWith("•"))
      ) {
        // This is a topic within the module
        currentModule.content.push(trimmedLine.substring(1).trim());
      } else if (currentModule && trimmedLine) {
        // This is a continuation of the module title or description
        currentModule.title += " " + trimmedLine;
      }
    });

    if (currentModule) {
      modules.push(currentModule);
    }

    // Convert to Accordion items format
    return modules.map((module, index) => ({
      id: module.id,
      title: module.title,
      content: (
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-600">
          {module.content.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>
      ),
    }));
  }

  // Parse objectives string into array
  const objectivesArray =
    training.objectives?.split("\n").filter((obj) => obj.trim()) || [];

  // Parse eligibility string into array
  const eligibilityArray =
    training.eligibility?.split("\n").filter((el) => el.trim()) || [];

  // Parse resources string into array
  const resourcesArray =
    training.resources?.split("\n").filter((res) => res.trim()) || [];

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
        <title>{training.title} - MTMKay</title>
        <meta name="description" content={training.summary} />
        <meta property="og:title" content={training.title} />
        <meta property="og:description" content={training.summary} />
        {training.imageUrl && (
          <meta property="og:image" content={training.imageUrl} />
        )}
        <link
          rel="canonical"
          href={`https://www.mtmkay.com/trainings/${training.slug}`}
        />
      </Helmet>

      {/* Banner */}
      <header
        className="relative bg-cover bg-center h-64 md:h-80 flex items-center justify-center text-white"
        style={{
          backgroundImage: training.imageUrl
            ? `linear-gradient(rgba(29, 78, 216, 0.7), rgba(29, 78, 216, 0.7)), url(${training.imageUrl})`
            : `linear-gradient(rgba(29, 78, 216, 0.9), rgba(29, 78, 216, 0.9))`,
        }}
      >
        <div className="text-center px-4">
          <p className="text-lg font-semibold tracking-wider uppercase">
            {training.category || "IT Training"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">
            {training.title}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
            <p className="text-gray-600 leading-relaxed mb-12">
              {training.summary}
            </p>

            {/* Objectives */}
            <div className="mb-12">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <Target className="mr-3 text-primary" /> Objectives
              </h3>
              {objectivesArray.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside pl-4 text-gray-700">
                  {objectivesArray.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No objectives specified</p>
              )}
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <UserCheck className="mr-3 text-primary" /> Eligibility
                Requirements
              </h3>
              {eligibilityArray.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside pl-4 text-gray-700">
                  {eligibilityArray.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No eligibility requirements specified
                </p>
              )}
            </div>

            {/* Course Outline */}
            <div className="mb-12">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <BookOpen className="mr-3 text-primary" /> Course Outline
              </h3>
              {courseOutlineItems.length > 0 ? (
                <Accordion items={courseOutlineItems} />
              ) : (
                <p className="text-gray-500 italic">
                  No course outline available
                </p>
              )}
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-bold flex items-center mb-4">
                <Box className="mr-3 text-primary" /> Training Resources
              </h3>
              {resourcesArray.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside pl-4 text-gray-700">
                  {resourcesArray.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No resources specified</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-xl font-bold mb-4">
                Available Training Slots
              </h3>

              {training.slots && training.slots.length > 0 ? (
                <div className="space-y-4">
                  {training.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="border border-gray-200 p-4 rounded-md"
                    >
                      <p className="flex items-center text-gray-700 mb-1">
                        <Calendar size={16} className="mr-2 text-primary" />{" "}
                        {formatDate(slot.startDate)} -{" "}
                        {formatDate(slot.endDate)}
                      </p>
                      <p className="flex items-center text-gray-700 mb-1">
                        <Clock size={16} className="mr-2 text-primary" />{" "}
                        {slot.schedule || "Schedule not specified"}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Users size={16} className="mr-2 text-primary" />{" "}
                        {slot.availableSeats} / {slot.seats} seats available
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No training slots available at the moment
                </p>
              )}

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Price:</span>
                  <span className="text-2xl font-bold text-primary">
                    {training.price?.toLocaleString()} XAF
                  </span>
                </div>

                <Button
                  onClick={() =>
                    navigate("/register", {
                      state: {
                        trainingId: training.id,
                        trainingSlug: training.slug,
                      },
                    })
                  }
                  size="lg"
                  className="w-full"
                  disabled={!training.slots || training.slots.length === 0}
                >
                  {training.slots && training.slots.length > 0
                    ? "Register Now"
                    : "No Slots Available"}
                </Button>

                {(!training.slots || training.slots.length === 0) && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Check back later for new training sessions
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default TrainingDetail;
