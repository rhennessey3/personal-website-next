'use client';

import { useState, useEffect } from 'react';
import { Button, type ButtonProps } from "@/components/ui/button"; // Explicitly import ButtonProps
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { client } from '@/sanity/client'; // Import Sanity client
import imageUrlBuilder from '@sanity/image-url'; // Import image URL builder
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configure image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}

// Define types based on Sanity schema (adjust as needed)
interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: any;
  crop?: any;
}

interface WorkExperienceSanity {
  _id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description: string;
  keyAchievements?: string[];
}

interface EducationSanity {
  _id: string;
  institution: string;
  degree: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
}

interface SkillSanity {
  _id: string;
  category: string;
  name: string;
  proficiency?: number; // Assuming proficiency might be optional or handled differently
}

interface ProfileSanity {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  profileImage?: SanityImageReference;
  contactEmail: string;
  workExperiences?: WorkExperienceSanity[];
  educationHistory?: EducationSanity[];
  skills?: SkillSanity[];
}

// Helper function to format date ranges
const formatDateRange = (start: string, end?: string): string => {
  const startDate = new Date(start);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.toLocaleString('default', { month: 'short' });

  if (!end) {
    return `${startMonth} ${startYear} - Present`;
  }

  const endDate = new Date(end);
  const endYear = endDate.getFullYear();
  const endMonth = endDate.toLocaleString('default', { month: 'short' });

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${endYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

// Helper function to group skills by category
const groupSkillsByCategory = (skills: SkillSanity[] = []): Record<string, SkillSanity[]> => {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillSanity[]>);
};


export default function AboutPage() {
  const [profileData, setProfileData] = useState<ProfileSanity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // GROQ query to fetch the first profile document and its referenced data
        const query = `*[_type == "profile"][0] {
          _id,
          firstName,
          lastName,
          title,
          bio,
          profileImage,
          contactEmail,
          "workExperiences": workExperiences[]->{
            _id,
            company,
            position,
            location,
            startDate,
            endDate,
            description,
            keyAchievements
          } | order(startDate desc),
          "educationHistory": educationHistory[]->{
            _id,
            institution,
            degree,
            startDate,
            endDate,
            description
          } | order(startDate desc),
          "skills": skills[]->{
            _id,
            category,
            name,
            proficiency
          }
        }`;
        const data: ProfileSanity = await client.fetch(query);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading profile information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !profileData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
        <p>{error?.message || "Profile data could not be loaded. Please try again later."}</p>
        {/* Optional: Add a retry button if appropriate */}
        {/* <Button className="mt-4" onClick={fetchProfileData}>Retry</Button> */}
      </div>
    );
  }

  const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
  // Ensure an array is passed, even if profileData.skills is null/undefined
  const groupedSkills = groupSkillsByCategory(profileData.skills || []);

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
          {profileData.profileImage ? (
            <img
              src={urlFor(profileData.profileImage).width(256).height(256).fit('crop').url()}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl text-neutral-500">Profile Image</span>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{fullName}</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            {profileData.title}
          </p>
          <p className="max-w-2xl">
            {profileData.bio}
          </p>
          <div className="flex gap-4 pt-2">
            {/* TODO: Implement Download Resume functionality */}
            <Button disabled>Download Resume</Button>
            {/* TODO: Implement smooth scroll or link to contact section */}
            <Button variant="outline">Contact Me</Button>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      {profileData.workExperiences && profileData.workExperiences.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
          <div className="space-y-6">
            {profileData.workExperiences.map((job) => (
              <Card key={job._id}>
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <CardTitle>{job.position}</CardTitle>
                      <CardDescription>{job.company}{job.location ? `, ${job.location}` : ''}</CardDescription>
                    </div>
                    <span className="text-sm text-neutral-500 whitespace-nowrap">
                      {formatDateRange(job.startDate, job.endDate)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{job.description}</p>
                  {job.keyAchievements && job.keyAchievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {job.keyAchievements.map((ach, index) => (
                          <li key={index}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {profileData.educationHistory && profileData.educationHistory.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Education</h2>
          <div className="space-y-4">
            {profileData.educationHistory.map((edu) => (
              <Card key={edu._id}>
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <CardTitle>{edu.degree}</CardTitle>
                      <CardDescription>{edu.institution}</CardDescription>
                    </div>
                    <span className="text-sm text-neutral-500 whitespace-nowrap">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                </CardHeader>
                {edu.description && (
                   <CardContent>
                     <p className="text-sm">{edu.description}</p>
                   </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {profileData.skills && profileData.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedSkills).map(([category, skillsInCategory]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillsInCategory.map((skill) => (
                      <span
                        key={skill._id}
                        className="inline-block bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section id="contact"> {/* Added ID for potential linking */}
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Me</CardTitle>
            <CardDescription>
              Fill out the form below and I&apos;ll get back to you via {profileData.contactEmail || 'email'} as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}