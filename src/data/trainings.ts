import { Training } from "../../types";

export const trainingsData: Training[] = [
  {
    id: "web-development-bootcamp",
    title: "Full-Stack Web Development Bootcamp",
    category: "Web Development",
    shortDescription:
      "Become a job-ready web developer. Learn front-end and back-end technologies to build modern web applications.",
    bannerImage: "/Full-Stack-Developer-Bootcamp.jpeg",
    objectives: [
      "Master HTML, CSS, and JavaScript fundamentals.",
      "Build responsive user interfaces with React.",
      "Develop robust back-end APIs with Node.js and Express.",
      "Manage databases with MongoDB.",
      "Deploy full-stack applications to the cloud.",
    ],
    eligibility: [
      "Basic computer literacy.",
      "No prior programming experience required.",
      "Strong desire to learn and build.",
    ],
    outline: [
      {
        id: "m1",
        title: "Module 1: Frontend Fundamentals",
        duration: "4 Weeks",
        topics: [
          "HTML5 & CSS3",
          "Flexbox & Grid",
          "Responsive Design",
          "JavaScript Basics",
          "DOM Manipulation",
        ],
      },
      {
        id: "m2",
        title: "Module 2: Advanced JavaScript & React",
        duration: "4 Weeks",
        topics: [
          "ES6+ Features",
          "Asynchronous JavaScript",
          "React Components & Props",
          "State Management (useState, useEffect)",
          "React Router",
        ],
      },
      {
        id: "m3",
        title: "Module 3: Backend Development with Node.js",
        duration: "4 Weeks",
        topics: [
          "Introduction to Node.js",
          "Express.js Framework",
          "RESTful API Design",
          "Middleware",
          "Authentication & Authorization",
        ],
      },
      {
        id: "m4",
        title: "Module 4: Databases and Deployment",
        duration: "3 Weeks",
        topics: [
          "MongoDB and Mongoose",
          "Data Modeling",
          "CRUD Operations",
          "Deploying to Heroku/Vercel",
          "Final Project",
        ],
      },
    ],
    jobOpportunities: [
      "Frontend Developer",
      "Backend Developer",
      "Full-Stack Developer",
      "Software Engineer",
    ],
    resources: [
      "Access to course materials on our portal",
      "Weekly live Q&A sessions",
      "Private Slack community",
      "Career guidance and portfolio review",
    ],
    slots: [
      {
        id: "slot1",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        schedule: "Mon, Wed - 6 PM to 9 PM",
        seats: 20,
        availableSeats: 5,
      },
      {
        id: "slot2",
        startDate: "2024-10-15",
        endDate: "2025-01-30",
        schedule: "Tue, Thu - 6 PM to 9 PM",
        seats: 20,
        availableSeats: 12,
      },
    ],
  },
  {
    id: "data-science-mastery",
    title: "Data Science & Machine Learning Mastery",
    category: "Data Science",
    shortDescription:
      "Dive into the world of data. Learn Python, statistical analysis, and machine learning to extract valuable insights.",
    bannerImage: "/Data-Science.jpeg",
    objectives: [
      "Master data analysis and visualization with Python (Pandas, Matplotlib, Seaborn).",
      "Understand statistical concepts for data science.",
      "Implement various machine learning algorithms (e.g., Regression, Classification).",
      "Work with real-world datasets on capstone projects.",
    ],
    eligibility: [
      "Basic understanding of programming concepts.",
      "Familiarity with high school level mathematics.",
    ],
    outline: [
      {
        id: "dsm1",
        title: "Module 1: Python for Data Science",
        duration: "4 Weeks",
        topics: [
          "Python Basics",
          "NumPy for numerical data",
          "Pandas for data manipulation",
          "Data Visualization with Matplotlib",
        ],
      },
      {
        id: "dsm2",
        title: "Module 2: Machine Learning Foundations",
        duration: "5 Weeks",
        topics: [
          "Supervised vs. Unsupervised Learning",
          "Linear & Logistic Regression",
          "Decision Trees",
          "Model Evaluation",
        ],
      },
    ],
    jobOpportunities: [
      "Data Analyst",
      "Data Scientist",
      "Machine Learning Engineer",
      "Business Intelligence Analyst",
    ],
    resources: [
      "Jupyter Notebooks for all lessons",
      "Access to large datasets",
      "Dedicated mentor support",
    ],
    slots: [
      {
        id: "dsslot1",
        startDate: "2024-09-10",
        endDate: "2024-12-20",
        schedule: "Weekends - 10 AM to 2 PM",
        seats: 15,
        availableSeats: 3,
      },
    ],
  },
  {
    id: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    category: "Cloud & DevOps",
    shortDescription:
      "Become an AWS expert. Learn to design, deploy, and manage scalable and fault-tolerant systems on Amazon Web Services.",
    bannerImage: "/Cloud-Computing.jpeg",
    objectives: [
      "Understand core AWS services (EC2, S3, VPC, RDS).",
      "Learn about serverless computing with AWS Lambda.",
      "Implement infrastructure as code using AWS CloudFormation.",
      "Prepare for AWS Certified Solutions Architect - Associate exam.",
    ],
    eligibility: [
      "Basic IT knowledge (networking, operating systems).",
      "No prior cloud experience required.",
    ],
    outline: [
      {
        id: "ccm1",
        title: "Module 1: AWS Fundamentals",
        duration: "3 Weeks",
        topics: ["Introduction to Cloud Computing", "IAM", "EC2 and EBS", "S3"],
      },
      {
        id: "ccm2",
        title: "Module 2: Networking and Databases",
        duration: "3 Weeks",
        topics: ["VPC", "Route 53", "RDS", "DynamoDB"],
      },
    ],
    jobOpportunities: [
      "Cloud Engineer",
      "DevOps Engineer",
      "Solutions Architect",
      "SysOps Administrator",
    ],
    resources: [
      "AWS Free Tier hands-on labs",
      "Exam preparation materials",
      "Practice tests",
    ],
    slots: [
      {
        id: "ccslot1",
        startDate: "2024-09-15",
        endDate: "2024-11-15",
        schedule: "Tue, Thu - 7 PM to 9 PM",
        seats: 25,
        availableSeats: 10,
      },
    ],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst Professional",
    category: "Cybersecurity",
    shortDescription:
      "Learn to protect digital assets. Gain skills in network security, ethical hacking, and incident response.",
    bannerImage: "/Cybersecurity.jpeg",
    objectives: [
      "Understand core cybersecurity principles.",
      "Perform vulnerability assessments.",
      "Analyze and respond to security incidents.",
      "Use industry-standard security tools.",
    ],
    eligibility: [
      "Strong interest in IT security.",
      "Basic networking knowledge is recommended.",
    ],
    outline: [
      {
        id: "csm1",
        title: "Module 1: Security Fundamentals",
        duration: "4 Weeks",
        topics: [
          "Threats and Vulnerabilities",
          "Cryptography",
          "Network Security",
          "Identity and Access Management",
        ],
      },
      {
        id: "csm2",
        title: "Module 2: Ethical Hacking & Pen Testing",
        duration: "4 Weeks",
        topics: [
          "Reconnaissance",
          "Scanning",
          "Gaining Access",
          "Maintaining Access",
        ],
      },
    ],
    jobOpportunities: [
      "Cybersecurity Analyst",
      "Security Operations Center (SOC) Analyst",
      "Penetration Tester",
      "Security Consultant",
    ],
    resources: [
      "Virtual labs for hands-on practice",
      "Real-world case studies",
      "Capture The Flag (CTF) exercises",
    ],
    slots: [
      {
        id: "csslot1",
        startDate: "2024-10-01",
        endDate: "2025-01-20",
        schedule: "Mon, Fri - 5 PM to 7 PM",
        seats: 18,
        availableSeats: 8,
      },
    ],
  },
];
