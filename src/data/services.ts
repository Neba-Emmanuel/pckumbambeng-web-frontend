import { Service } from "../../types";
import { Briefcase, Cloud, Shield, Code, Coffee } from "lucide-react";

export const servicesData: Service[] = [
  {
    id: "work-cafe",
    title: "Work Café",
    description:
      "A quiet, professional workspace with reliable internet and power. Ideal for focused work, online learning, and remote jobs.",
    icon: Coffee,
    category: "work-cafe",
    featured: true,
    learnMoreLink: "/work-cafe",
  },
  {
    id: "corporate-training",
    title: "Corporate IT Training",
    description:
      "Customized training programs for your team to upskill in the latest technologies. We cover everything from web development to cloud computing and cybersecurity.",
    icon: Briefcase,
    category: "learning-facilitation",
  },
  {
    id: "cloud-consulting",
    title: "Cloud Solutions Consulting",
    description:
      "Expert guidance on cloud strategy, migration, and management. We help you leverage the power of AWS, Azure, and Google Cloud to optimize your infrastructure.",
    icon: Cloud,
    category: "cloud-cyber",
  },
  {
    id: "cybersecurity-services",
    title: "Cybersecurity Assessment",
    description:
      "Protect your digital assets with our comprehensive security services, including vulnerability assessments, penetration testing, and incident response planning.",
    icon: Shield,
    category: "cloud-cyber",
  },
  {
    id: "software-development",
    title: "Custom Software Development",
    description:
      "We build tailored software solutions to meet your unique business needs, from web applications to mobile apps, ensuring scalability and performance.",
    icon: Code,
    category: "other-offerings",
  },
];
