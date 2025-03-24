'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { useApi } from "@/hooks/useApi";
import { getProfile } from "@/lib/api";
import { Profile } from "@/lib/types";

export default function AboutPage() {
  // Fetch profile data from API
  const { data: profile, loading, error } = useApi<Profile>(getProfile);

  // Fallback data in case of error or during loading
  const fallbackData: Profile = {
    id: "1",
    name: "Richard Hennessey",
    title: "Product Management & UX Strategy Professional",
    bio: "With over 10 years of experience, I specialize in aligning product vision with business needs while creating exceptional user experiences. I'm passionate about solving complex problems through thoughtful product strategy and user-centered design.",
    work_experiences: [
      {
        id: "1",
        profile_id: "1",
        title: "Senior Product Manager",
        company: "Tech Innovations Inc.",
        period: "2022 - Present",
        description: "Leading product strategy and development for enterprise SaaS platform. Increased user engagement by 40% and reduced churn by 15% through data-driven product improvements.",
        order: 1,
        created_at: "",
        updated_at: ""
      },
      {
        id: "2",
        profile_id: "1",
        title: "Product Manager",
        company: "Digital Solutions Group",
        period: "2019 - 2022",
        description: "Managed the product lifecycle for consumer mobile applications. Led cross-functional teams to deliver features that increased user retention by 25%.",
        order: 2,
        created_at: "",
        updated_at: ""
      },
      {
        id: "3",
        profile_id: "1",
        title: "UX Strategist",
        company: "Creative Design Agency",
        period: "2016 - 2019",
        description: "Developed UX strategies for clients across various industries. Created user research frameworks and design systems that improved client satisfaction scores by 30%.",
        order: 3,
        created_at: "",
        updated_at: ""
      },
      {
        id: "4",
        profile_id: "1",
        title: "Product Designer",
        company: "Startup Ventures",
        period: "2014 - 2016",
        description: "Designed user interfaces for early-stage startups. Collaborated with founders to translate business requirements into intuitive user experiences.",
        order: 4,
        created_at: "",
        updated_at: ""
      }
    ],
    education: [
      {
        id: "1",
        profile_id: "1",
        degree: "MBA, Product Management",
        institution: "Business University",
        year: "2018",
        order: 1,
        created_at: "",
        updated_at: ""
      },
      {
        id: "2",
        profile_id: "1",
        degree: "BS, Human-Computer Interaction",
        institution: "Tech Institute",
        year: "2014",
        order: 2,
        created_at: "",
        updated_at: ""
      }
    ],
    skills: [
      { 
        id: "1", 
        profile_id: "1", 
        category: "Product Management", 
        items: ["Product Strategy", "Roadmapping", "User Research", "A/B Testing", "Agile Methodologies", "Product Analytics"],
        order: 1,
        created_at: "",
        updated_at: ""
      },
      { 
        id: "2", 
        profile_id: "1", 
        category: "UX Design", 
        items: ["User-Centered Design", "Information Architecture", "Wireframing", "Prototyping", "Usability Testing"],
        order: 2,
        created_at: "",
        updated_at: ""
      },
      { 
        id: "3", 
        profile_id: "1", 
        category: "Technical", 
        items: ["Product Requirements", "Data Analysis", "SQL", "HTML/CSS", "Figma", "JIRA"],
        order: 3,
        created_at: "",
        updated_at: ""
      },
      { 
        id: "4", 
        profile_id: "1", 
        category: "Leadership", 
        items: ["Team Management", "Stakeholder Communication", "Cross-functional Collaboration", "Mentoring", "Presentations"],
        order: 4,
        created_at: "",
        updated_at: ""
      }
    ],
    image_url: "",
    created_at: "",
    updated_at: ""
  };

  // Use profile data if available, otherwise use fallback data
  const profileData = profile || fallbackData;
  
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
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
        <p>{error.message || "Failed to load profile information. Please try again later."}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          {profileData.image_url ? (
            <img 
              src={profileData.image_url} 
              alt={profileData.name} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xl text-neutral-500">Profile Image</span>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{profileData.name}</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            {profileData.title}
          </p>
          <p className="max-w-2xl">
            {profileData.bio}
          </p>
          <div className="flex gap-4 pt-2">
            <Button>Download Resume</Button>
            <Button variant="outline">Contact Me</Button>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
        <div className="space-y-6">
          {profileData.work_experiences.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  <span className="text-sm text-neutral-500">{job.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Education</h2>
        <div className="space-y-4">
          {profileData.education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{edu.degree}</CardTitle>
                    <CardDescription>{edu.institution}</CardDescription>
                  </div>
                  <span className="text-sm text-neutral-500">{edu.year}</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileData.skills.map((skillGroup) => (
            <Card key={skillGroup.id}>
              <CardHeader>
                <CardTitle>{skillGroup.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-block bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Me</CardTitle>
            <CardDescription>
              Fill out the form below and I&apos;ll get back to you as soon as possible.
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