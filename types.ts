// Fix: Import React to provide the 'React' namespace for ElementType.
import React from "react";

export interface Training {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  bannerImage: string;
  objectives: string[];
  eligibility: string[];
  outline: CourseModule[];
  jobOpportunities: string[];
  resources: string[];
  slots: TrainingSlot[];
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface TrainingSlot {
  id: string;
  startDate: string;
  endDate: string;
  schedule: string; // e.g., 'Mon, Wed, Fri - 6 PM to 8 PM'
  seats: number;
  availableSeats: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  thumbnail: string;
  intro: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category?: string;
  featured?: boolean;
  learnMoreLink?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  trainingId: string;
  trainingTitle: string;
  slotId: string;
  registrationDate: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  method: "MTN Mobile Money" | "Orange Money";
  transactionRef: string;
  paymentDate: string;
  status: "Success" | "Failed" | "Pending";
}
