'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { Plus, Trash, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';
import { getAdminProfile, updateProfile, uploadImage as uploadImageApi } from '@/lib/api';
import { Profile, WorkExperience, Education, Skill } from '@/lib/types';

// Define the AdminProfile type for the component
type AdminProfile = Profile;

// Function to get the profile
const getProfile = async (): Promise<AdminProfile | null> => {
  try {
    // Get profile from API
    const profile = await getAdminProfile();
    return profile as AdminProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Function to save the profile
const saveProfile = async (profile: AdminProfile): Promise<AdminProfile> => {
  try {
    // Update profile
    const updatedProfile = await updateProfile(profile);
    return updatedProfile as AdminProfile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Function to upload an image
const uploadImage = async (file: File): Promise<string> => {
  try {
    return await uploadImageApi(file, 'profiles');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default function ProfileEditPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New work experience form state
  const [newWorkExperience, setNewWorkExperience] = useState<Omit<WorkExperience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>({
    title: '',
    company: '',
    period: '',
    description: '',
    order: 0
  });
  
  // New education form state
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>({
    degree: '',
    institution: '',
    year: '',
    order: 0
  });
  
  // New skill form state
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>({
    category: '',
    items: [],
    order: 0
  });
  
  // New skill items input
  const [newSkillItems, setNewSkillItems] = useState('');

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/admin/login?from=/admin/profile');
    }
  }, [router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        if (data?.image_url) {
          setPreviewUrl(data.image_url);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Work experience handlers
  const handleNewWorkExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWorkExperience(prev => ({ ...prev, [name]: value }));
  };

  const addWorkExperience = () => {
    if (!profile) return;
    if (!newWorkExperience.title || !newWorkExperience.company || !newWorkExperience.period || !newWorkExperience.description) return;

    const newWorkExperienceObj: WorkExperience = {
      id: `temp-${Date.now()}`, // In a real app, the backend would assign an ID
      profile_id: profile.id,
      title: newWorkExperience.title,
      company: newWorkExperience.company,
      period: newWorkExperience.period,
      description: newWorkExperience.description,
      order: profile.work_experiences?.length || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        work_experiences: [...(prev.work_experiences || []), newWorkExperienceObj]
      };
    });

    // Reset the form
    setNewWorkExperience({
      title: '',
      company: '',
      period: '',
      description: '',
      order: (profile.work_experiences?.length || 0) + 1
    });
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    if (!profile?.work_experiences) return;

    const updatedWorkExperiences = [...profile.work_experiences];
    updatedWorkExperiences[index] = {
      ...updatedWorkExperiences[index],
      [field]: value
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        work_experiences: updatedWorkExperiences
      };
    });
  };

  const moveWorkExperience = (index: number, direction: 'up' | 'down') => {
    if (!profile?.work_experiences) return;
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === profile.work_experiences.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedWorkExperiences = [...profile.work_experiences];
    
    // Swap the work experiences
    [updatedWorkExperiences[index], updatedWorkExperiences[newIndex]] = [updatedWorkExperiences[newIndex], updatedWorkExperiences[index]];
    
    // Update the order values
    updatedWorkExperiences.forEach((experience, i) => {
      experience.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        work_experiences: updatedWorkExperiences
      };
    });
  };

  const removeWorkExperience = (index: number) => {
    if (!profile?.work_experiences) return;

    const updatedWorkExperiences = profile.work_experiences.filter((_, i) => i !== index);
    
    // Update the order values
    updatedWorkExperiences.forEach((experience, i) => {
      experience.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        work_experiences: updatedWorkExperiences
      };
    });
  };

  // Education handlers
  const handleNewEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    if (!profile) return;
    if (!newEducation.degree || !newEducation.institution || !newEducation.year) return;

    const newEducationObj: Education = {
      id: `temp-${Date.now()}`, // In a real app, the backend would assign an ID
      profile_id: profile.id,
      degree: newEducation.degree,
      institution: newEducation.institution,
      year: newEducation.year,
      order: profile.education?.length || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        education: [...(prev.education || []), newEducationObj]
      };
    });

    // Reset the form
    setNewEducation({
      degree: '',
      institution: '',
      year: '',
      order: (profile.education?.length || 0) + 1
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    if (!profile?.education) return;

    const updatedEducation = [...profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (!profile?.education) return;
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === profile.education.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedEducation = [...profile.education];
    
    // Swap the education entries
    [updatedEducation[index], updatedEducation[newIndex]] = [updatedEducation[newIndex], updatedEducation[index]];
    
    // Update the order values
    updatedEducation.forEach((edu, i) => {
      edu.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  const removeEducation = (index: number) => {
    if (!profile?.education) return;

    const updatedEducation = profile.education.filter((_, i) => i !== index);
    
    // Update the order values
    updatedEducation.forEach((edu, i) => {
      edu.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  // Skills handlers
  const handleNewSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleNewSkillItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkillItems(e.target.value);
    
    // Update items array by splitting the comma-separated string
    const itemsArray = e.target.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setNewSkill(prev => ({ ...prev, items: itemsArray }));
  };

  const addSkill = () => {
    if (!profile) return;
    if (!newSkill.category || newSkill.items.length === 0) return;

    const newSkillObj: Skill = {
      id: `temp-${Date.now()}`, // In a real app, the backend would assign an ID
      profile_id: profile.id,
      category: newSkill.category,
      items: newSkill.items,
      order: profile.skills?.length || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skills: [...(prev.skills || []), newSkillObj]
      };
    });

    // Reset the form
    setNewSkill({
      category: '',
      items: [],
      order: (profile.skills?.length || 0) + 1
    });
    setNewSkillItems('');
  };

  const updateSkill = (index: number, field: string, value: string | string[]) => {
    if (!profile?.skills) return;

    const updatedSkills = [...profile.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  const updateSkillItems = (index: number, itemsString: string) => {
    if (!profile?.skills) return;
    
    const itemsArray = itemsString
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    updateSkill(index, 'items', itemsArray);
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    if (!profile?.skills) return;
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === profile.skills.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSkills = [...profile.skills];
    
    // Swap the skills
    [updatedSkills[index], updatedSkills[newIndex]] = [updatedSkills[newIndex], updatedSkills[index]];
    
    // Update the order values
    updatedSkills.forEach((skill, i) => {
      skill.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  const removeSkill = (index: number) => {
    if (!profile?.skills) return;

    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    
    // Update the order values
    updatedSkills.forEach((skill, i) => {
      skill.order = i;
    });

    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  // Image upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !profile) return;
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload the image
      const imageUrl = await uploadImage(selectedFile);
      
      // Update the profile
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          image_url: imageUrl
        };
      });
      
      // Clear the progress
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setSelectedFile(null);
      }, 1000);
      
    } catch {
      // Catch any errors without assigning to a variable
      setError('Failed to upload image');
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadProgress(0);
    
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        image_url: undefined
      };
    });
  };

  // Main form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);

    try {
      // If there's a selected file that hasn't been uploaded yet, upload it first
      if (selectedFile && !uploadProgress) {
        const imageUrl = await uploadImage(selectedFile);
        profile.image_url = imageUrl;
      }

      await saveProfile(profile);
      router.push('/admin');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save profile');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
        <Button className="mt-4" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Profile Not Found</h3>
        <p>The profile could not be loaded.</p>
        <Button className="mt-4" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={profile.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>Upload a profile image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile image preview"
                    className="max-h-64 rounded-md object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={removeImage}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!previewUrl && (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-500">
                    Upload a profile image
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="profile_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="profile_image"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  >
                    Browse Files
                  </label>
                  
                  {selectedFile && uploadProgress === 0 && (
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                    >
                      Upload Image
                    </Button>
                  )}
                  
                  {selectedFile && (
                    <span className="text-sm text-neutral-500">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                
                {uploadProgress > 0 && (
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Add your work experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing work experiences */}
            {profile.work_experiences && profile.work_experiences.length > 0 ? (
              <div className="space-y-4">
                {profile.work_experiences.map((experience, index) => (
                  <div
                    key={experience.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">
                          Order: {experience.order + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveWorkExperience(index, 'up')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {profile.work_experiences && index < (profile.work_experiences.length - 1) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveWorkExperience(index, 'down')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeWorkExperience(index)}
                          type="button"
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        value={experience.title}
                        onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Period</label>
                      <input
                        type="text"
                        value={experience.period}
                        onChange={(e) => updateWorkExperience(index, 'period', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={experience.description}
                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No work experience added yet. Use the form below to add your first work experience.
              </div>
            )}

            {/* Add new work experience form */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3 mt-4">
              <h4 className="font-medium">Add New Work Experience</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newWorkExperience.title}
                  onChange={handleNewWorkExperienceChange}
                  placeholder="e.g., Senior Product Manager"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={newWorkExperience.company}
                  onChange={handleNewWorkExperienceChange}
                  placeholder="e.g., Acme Inc."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Period</label>
                <input
                  type="text"
                  name="period"
                  value={newWorkExperience.period}
                  onChange={handleNewWorkExperienceChange}
                  placeholder="e.g., 2020 - Present"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={newWorkExperience.description}
                  onChange={handleNewWorkExperienceChange}
                  rows={3}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <Button
                type="button"
                onClick={addWorkExperience}
                className="w-full"
                disabled={!newWorkExperience.title || !newWorkExperience.company || !newWorkExperience.period || !newWorkExperience.description}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Work Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Add your educational background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing education entries */}
            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">
                          Order: {edu.order + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveEducation(index, 'up')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {profile.education && index < (profile.education.length - 1) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveEducation(index, 'down')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeEducation(index)}
                          type="button"
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No education added yet. Use the form below to add your first education entry.
              </div>
            )}

            {/* Add new education form */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3 mt-4">
              <h4 className="font-medium">Add New Education</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={newEducation.degree}
                  onChange={handleNewEducationChange}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={newEducation.institution}
                  onChange={handleNewEducationChange}
                  placeholder="e.g., Stanford University"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <input
                  type="text"
                  name="year"
                  value={newEducation.year}
                  onChange={handleNewEducationChange}
                  placeholder="e.g., 2015"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <Button
                type="button"
                onClick={addEducation}
                className="w-full"
                disabled={!newEducation.degree || !newEducation.institution || !newEducation.year}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your skills by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing skills */}
            {profile.skills && profile.skills.length > 0 ? (
              <div className="space-y-4">
                {profile.skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500">
                          Order: {skill.order + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveSkill(index, 'up')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {profile.skills && index < (profile.skills.length - 1) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveSkill(index, 'down')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeSkill(index)}
                          type="button"
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <input
                        type="text"
                        value={skill.category}
                        onChange={(e) => updateSkill(index, 'category', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={skill.items.join(', ')}
                        onChange={(e) => updateSkillItems(index, e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    {skill.items.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skill.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No skills added yet. Use the form below to add your first skill category.
              </div>
            )}

            {/* Add new skill form */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3 mt-4">
              <h4 className="font-medium">Add New Skill Category</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newSkill.category}
                  onChange={handleNewSkillChange}
                  placeholder="e.g., Programming Languages"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkillItems}
                  onChange={handleNewSkillItemsChange}
                  placeholder="e.g., JavaScript, TypeScript, Python"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
                <p className="text-xs text-neutral-500">
                  Separate skills with commas (e.g., &quot;JavaScript, TypeScript, Python&quot;)
                </p>
              </div>
              
              {newSkill.items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newSkill.items.map((item, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                type="button"
                onClick={addSkill}
                className="w-full"
                disabled={!newSkill.category || newSkill.items.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill Category
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
