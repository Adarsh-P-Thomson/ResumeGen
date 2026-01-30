'use client';

import { useState } from 'react';
import type { Resume, Experience, Education, Project, Publication, Patent, Certification, Award, Volunteer } from '@/core';

interface FormData extends Omit<Resume, 'skills'> {
  skills: string;
}

interface OptionalSections {
  publications: boolean;
  patents: boolean;
  certifications: boolean;
  awards: boolean;
  volunteer: boolean;
}

export default function ResumeForm() {
  const [formData, setFormData] = useState<FormData>({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      links: [''],
    },
    education: [{
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      location: '',
      bullets: [''],
    }],
    experience: [{
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    }],
    projects: [{
      name: '',
      technologies: [],
      startDate: '',
      endDate: '',
      bullets: [''],
      links: [''],
    }],
    skills: '',
    publications: [],
    patents: [],
    certifications: [],
    awards: [],
    volunteer: [],
  });

  const [optionalSections, setOptionalSections] = useState<OptionalSections>({
    publications: false,
    patents: false,
    certifications: false,
    awards: false,
    volunteer: false,
  });

  const [format, setFormat] = useState<'txt' | 'pdf' | 'docx' | 'html'>('pdf');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  
  // AI Refinement state
  const [jobDescription, setJobDescription] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [refining, setRefining] = useState(false);
  const [aiModel, setAiModel] = useState(process.env.NEXT_PUBLIC_MEGALLM_MODEL || 'deepseek-r1-distill-llama-70b');

  // Toggle optional section
  const toggleSection = (section: keyof OptionalSections) => {
    const newState = !optionalSections[section];
    setOptionalSections({
      ...optionalSections,
      [section]: newState,
    });
    
    // Initialize with empty entry if enabling
    if (newState && (!formData[section] || formData[section]?.length === 0)) {
      const emptyEntry = getEmptyEntry(section);
      setFormData({
        ...formData,
        [section]: [emptyEntry],
      });
    }
  };

  // Get empty entry for section
  const getEmptyEntry = (section: keyof OptionalSections): any => {
    switch (section) {
      case 'publications':
        return { title: '', authors: '', venue: '', date: '', doi: '', link: '' };
      case 'patents':
        return { title: '', patentNumber: '', date: '', status: '', inventors: '' };
      case 'certifications':
        return { name: '', issuer: '', date: '', expiryDate: '', credentialId: '', link: '' };
      case 'awards':
        return { title: '', issuer: '', date: '', description: '' };
      case 'volunteer':
        return { organization: '', role: '', startDate: '', endDate: '', description: '', bullets: [''] };
      default:
        return {};
    }
  };

  // Add education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
        location: '',
        bullets: [''],
      }],
    });
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  // Add experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        bullets: [''],
      }],
    });
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  // Add project entry
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...(formData.projects || []), {
        name: '',
        technologies: [],
        startDate: '',
        endDate: '',
        bullets: [''],
        links: [''],
      }],
    });
  };

  // Remove project entry
  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects?.filter((_, i) => i !== index),
    });
  };

  // Add bullet to section
  const addBullet = (section: 'education' | 'experience' | 'projects', index: number) => {
    const newData = { ...formData };
    if (section === 'education') {
      newData.education[index].bullets = [...(newData.education[index].bullets || []), ''];
    } else if (section === 'experience') {
      newData.experience[index].bullets = [...newData.experience[index].bullets, ''];
    } else if (section === 'projects' && newData.projects) {
      newData.projects[index].bullets = [...newData.projects[index].bullets, ''];
    }
    setFormData(newData);
  };

  // Generate resume
  const generateResume = async () => {
    setLoading(true);
    setError('');
    setPreview('');

    try {
      // Convert form data to Resume format
      const skillsArray = formData.skills
        .split('\n')
        .filter(s => s.trim())
        .map(s => s.trim());

      let resumeData: Resume = {
        ...formData,
        skills: skillsArray,
        projects: formData.projects?.filter(p => p.name.trim()) || undefined,
      };

      // Step 1: Refine with AI if enabled
      if (useAI && jobDescription.trim()) {
        setRefining(true);
        try {
          const refineResponse = await fetch('/api/refine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeData,
              jobDescription: jobDescription.trim(),
              model: aiModel,
            }),
          });

          if (!refineResponse.ok) {
            const refineError = await refineResponse.json();
            throw new Error(refineError.error || 'AI refinement failed');
          }

          const refineResult = await refineResponse.json();
          resumeData = refineResult.refinedData;
          console.log('Resume refined with AI successfully');
        } catch (aiError) {
          console.error('AI refinement error:', aiError);
          setError(`AI Refinement Warning: ${aiError instanceof Error ? aiError.message : 'Failed to refine'}. Proceeding with original data.`);
          // Continue with original data
        } finally {
          setRefining(false);
        }
      }

      // Step 2: Generate resume in selected format
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          format,
          exportFile: format === 'pdf' || format === 'docx',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate resume');
      }

      if (format === 'pdf' || format === 'docx') {
        // Download file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setPreview(`✓ Resume ${useAI && jobDescription.trim() ? 'refined with AI and ' : ''}downloaded as ${format.toUpperCase()}`);
      } else {
        // Show preview
        const result = await response.json();
        setPreview(result.formattedResume);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefining(false);
    }
  };

  // Export resume data as JSON
  const exportResumeData = () => {
    const skillsArray = formData.skills
      .split('\n')
      .filter(s => s.trim())
      .map(s => s.trim());

    const resumeData: Resume = {
      ...formData,
      skills: skillsArray,
      projects: formData.projects?.filter(p => p.name.trim()) || undefined,
    };

    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Import resume data from JSON
  const importResumeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Convert skills array to string
        const skillsString = Array.isArray(json.skills) ? json.skills.join('\n') : '';
        
        setFormData({
          ...json,
          skills: skillsString,
        });

        // Enable optional sections if they have data
        if (json.publications?.length > 0) {
          setOptionalSections(prev => ({ ...prev, publications: true }));
        }
        if (json.patents?.length > 0) {
          setOptionalSections(prev => ({ ...prev, patents: true }));
        }
        if (json.certifications?.length > 0) {
          setOptionalSections(prev => ({ ...prev, certifications: true }));
        }
        if (json.awards?.length > 0) {
          setOptionalSections(prev => ({ ...prev, awards: true }));
        }
        if (json.volunteer?.length > 0) {
          setOptionalSections(prev => ({ ...prev, volunteer: true }));
        }

        setError('');
        setPreview('✓ Resume data imported successfully!');
        setTimeout(() => setPreview(''), 3000);
      } catch (err) {
        setError('Failed to import JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Import/Export Section */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-300 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">💾 Save/Load Resume Data</h2>
        <p className="text-sm text-gray-600 mb-4">Export your resume as JSON to save your work, or import a previously saved file</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportResumeData}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> Export Resume JSON
          </button>
          <label className="px-4 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors cursor-pointer flex items-center gap-2">
            <span>📤</span> Import Resume JSON
            <input
              type="file"
              accept=".json"
              onChange={importResumeData}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* Personal Information */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.personal.name}
              onChange={(e) => setFormData({
                ...formData,
                personal: { ...formData.personal, name: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.personal.email}
              onChange={(e) => setFormData({
                ...formData,
                personal: { ...formData.personal, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.personal.phone}
              onChange={(e) => setFormData({
                ...formData,
                personal: { ...formData.personal, phone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.personal.location}
              onChange={(e) => setFormData({
                ...formData,
                personal: { ...formData.personal, location: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New York, NY"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Links (one per line)
            </label>
            <textarea
              value={formData.personal.links?.join('\n')}
              onChange={(e) => setFormData({
                ...formData,
                personal: { 
                  ...formData.personal, 
                  links: e.target.value.split('\n').filter(l => l.trim())
                }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="linkedin.com/in/johndoe&#10;github.com/johndoe&#10;portfolio.com"
            />
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          <button
            onClick={addEducation}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Education
          </button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Education {index + 1}</h3>
              {formData.education.length > 1 && (
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].institution = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Stanford University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].degree = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].field = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Date *
                </label>
                <input
                  type="text"
                  value={edu.graduationDate}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].graduationDate = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="May 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].gpa = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3.8/4.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => {
                    const newEducation = [...formData.education];
                    newEducation[index].location = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Stanford, CA"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (one per line)
              </label>
              <textarea
                value={edu.bullets?.join('\n')}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index].bullets = e.target.value.split('\n');
                  setFormData({ ...formData, education: newEducation });
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Relevant Coursework: Machine Learning, Data Structures"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
          <button
            onClick={addExperience}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Experience
          </button>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Experience {index + 1}</h3>
              {formData.experience.length > 1 && (
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].company = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TechCorp Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].role = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].startDate = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="June 2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (or "Present")
                </label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExperience = [...formData.experience];
                    newExperience[index].endDate = e.target.value;
                    setFormData({ ...formData, experience: newExperience });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Present"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievements (one per line) *
              </label>
              <textarea
                value={exp.bullets.join('\n')}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index].bullets = e.target.value.split('\n');
                  setFormData({ ...formData, experience: newExperience });
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Led development of microservices architecture serving 1M+ users&#10;Reduced API latency by 40% through optimization&#10;Mentored 3 junior developers"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use action verbs and include metrics (numbers, percentages, money)
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Projects (Optional)</h2>
          <button
            onClick={addProject}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Project
          </button>
        </div>
        {formData.projects?.map((proj, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Project {index + 1}</h3>
              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].name = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="AI Resume Generator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  value={proj.startDate}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].startDate = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jan 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (or "Present")
                </label>
                <input
                  type="text"
                  value={proj.endDate}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].endDate = e.target.value;
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Present"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies?.join(', ')}
                  onChange={(e) => {
                    const newProjects = [...(formData.projects || [])];
                    newProjects[index].technologies = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                    setFormData({ ...formData, projects: newProjects });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Impact (one per line)
              </label>
              <textarea
                value={proj.bullets.join('\n')}
                onChange={(e) => {
                  const newProjects = [...(formData.projects || [])];
                  newProjects[index].bullets = e.target.value.split('\n');
                  setFormData({ ...formData, projects: newProjects });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Built automated resume generator processing 500+ submissions&#10;Reduced generation time from 2 hours to 30 seconds&#10;Achieved 95% user satisfaction rating"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Links (one per line)
              </label>
              <textarea
                value={proj.links?.join('\n')}
                onChange={(e) => {
                  const newProjects = [...(formData.projects || [])];
                  newProjects[index].links = e.target.value.split('\n').filter(l => l.trim());
                  setFormData({ ...formData, projects: newProjects });
                }}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="github.com/username/project&#10;project-demo.com"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Optional Sections Toggle */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-300 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Optional Sections</h2>
        <p className="text-sm text-gray-600 mb-4">Add additional sections to strengthen your resume</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'publications' as const, label: 'Publications', icon: '📚', desc: 'Research papers, articles' },
            { key: 'patents' as const, label: 'Patents', icon: '💡', desc: 'Patent applications' },
            { key: 'certifications' as const, label: 'Certifications', icon: '🎓', desc: 'Professional certificates' },
            { key: 'awards' as const, label: 'Awards & Honors', icon: '🏆', desc: 'Achievements, recognitions' },
            { key: 'volunteer' as const, label: 'Volunteer Work', icon: '🤝', desc: 'Community service' },
          ].map(({ key, label, icon, desc }) => (
            <button
              key={key}
              onClick={() => toggleSection(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                optionalSections[key]
                  ? 'border-purple-600 bg-purple-100 shadow-md'
                  : 'border-gray-300 bg-white hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{icon}</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  optionalSections[key] ? 'bg-purple-600' : 'bg-gray-300'
                } relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    optionalSections[key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
              <div className="font-medium text-gray-900 text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Publications */}
      {optionalSections.publications && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📚 Publications</h2>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  publications: [...(formData.publications || []), getEmptyEntry('publications')],
                });
              }}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Publication
            </button>
          </div>
          {formData.publications?.map((pub, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Publication {index + 1}</h3>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      publications: formData.publications?.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={pub.title}
                    onChange={(e) => {
                      const newPubs = [...(formData.publications || [])];
                      newPubs[index].title = e.target.value;
                      setFormData({ ...formData, publications: newPubs });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deep Learning Approaches for Natural Language Processing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors *
                  </label>
                  <input
                    type="text"
                    value={pub.authors}
                    onChange={(e) => {
                      const newPubs = [...(formData.publications || [])];
                      newPubs[index].authors = e.target.value;
                      setFormData({ ...formData, publications: newPubs });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Smith, J., Doe, J., et al."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue/Journal *
                    </label>
                    <input
                      type="text"
                      value={pub.venue}
                      onChange={(e) => {
                        const newPubs = [...(formData.publications || [])];
                        newPubs[index].venue = e.target.value;
                        setFormData({ ...formData, publications: newPubs });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="IEEE Transactions on Neural Networks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="text"
                      value={pub.date}
                      onChange={(e) => {
                        const newPubs = [...(formData.publications || [])];
                        newPubs[index].date = e.target.value;
                        setFormData({ ...formData, publications: newPubs });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="March 2024"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DOI
                    </label>
                    <input
                      type="text"
                      value={pub.doi}
                      onChange={(e) => {
                        const newPubs = [...(formData.publications || [])];
                        newPubs[index].doi = e.target.value;
                        setFormData({ ...formData, publications: newPubs });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10.1109/TNNLS.2024.1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link
                    </label>
                    <input
                      type="text"
                      value={pub.link}
                      onChange={(e) => {
                        const newPubs = [...(formData.publications || [])];
                        newPubs[index].link = e.target.value;
                        setFormData({ ...formData, publications: newPubs });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://arxiv.org/abs/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Patents */}
      {optionalSections.patents && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">💡 Patents</h2>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  patents: [...(formData.patents || []), getEmptyEntry('patents')],
                });
              }}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Patent
            </button>
          </div>
          {formData.patents?.map((patent, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Patent {index + 1}</h3>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      patents: formData.patents?.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patent Title *
                  </label>
                  <input
                    type="text"
                    value={patent.title}
                    onChange={(e) => {
                      const newPatents = [...(formData.patents || [])];
                      newPatents[index].title = e.target.value;
                      setFormData({ ...formData, patents: newPatents });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="System and Method for Real-Time Data Processing"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patent Number *
                    </label>
                    <input
                      type="text"
                      value={patent.patentNumber}
                      onChange={(e) => {
                        const newPatents = [...(formData.patents || [])];
                        newPatents[index].patentNumber = e.target.value;
                        setFormData({ ...formData, patents: newPatents });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="US10123456B2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="text"
                      value={patent.date}
                      onChange={(e) => {
                        const newPatents = [...(formData.patents || [])];
                        newPatents[index].date = e.target.value;
                        setFormData({ ...formData, patents: newPatents });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="January 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <input
                      type="text"
                      value={patent.status}
                      onChange={(e) => {
                        const newPatents = [...(formData.patents || [])];
                        newPatents[index].status = e.target.value;
                        setFormData({ ...formData, patents: newPatents });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Granted / Pending"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inventors
                  </label>
                  <input
                    type="text"
                    value={patent.inventors}
                    onChange={(e) => {
                      const newPatents = [...(formData.patents || [])];
                      newPatents[index].inventors = e.target.value;
                      setFormData({ ...formData, patents: newPatents });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe, Jane Smith"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {optionalSections.certifications && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🎓 Certifications</h2>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  certifications: [...(formData.certifications || []), getEmptyEntry('certifications')],
                });
              }}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Certification
            </button>
          </div>
          {formData.certifications?.map((cert, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Certification {index + 1}</h3>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      certifications: formData.certifications?.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...(formData.certifications || [])];
                        newCerts[index].name = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuer *
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const newCerts = [...(formData.certifications || [])];
                        newCerts[index].issuer = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => {
                        const newCerts = [...(formData.certifications || [])];
                        newCerts[index].date = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="June 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cert.expiryDate}
                      onChange={(e) => {
                        const newCerts = [...(formData.certifications || [])];
                        newCerts[index].expiryDate = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="June 2027"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => {
                        const newCerts = [...(formData.certifications || [])];
                        newCerts[index].credentialId = e.target.value;
                        setFormData({ ...formData, certifications: newCerts });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ABC123DEF456"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Link
                  </label>
                  <input
                    type="text"
                    value={cert.link}
                    onChange={(e) => {
                      const newCerts = [...(formData.certifications || [])];
                      newCerts[index].link = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.credly.com/badges/..."
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Awards */}
      {optionalSections.awards && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🏆 Awards & Honors</h2>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  awards: [...(formData.awards || []), getEmptyEntry('awards')],
                });
              }}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Award
            </button>
          </div>
          {formData.awards?.map((award, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Award {index + 1}</h3>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      awards: formData.awards?.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Award Title *
                    </label>
                    <input
                      type="text"
                      value={award.title}
                      onChange={(e) => {
                        const newAwards = [...(formData.awards || [])];
                        newAwards[index].title = e.target.value;
                        setFormData({ ...formData, awards: newAwards });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Employee of the Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issued By *
                    </label>
                    <input
                      type="text"
                      value={award.issuer}
                      onChange={(e) => {
                        const newAwards = [...(formData.awards || [])];
                        newAwards[index].issuer = e.target.value;
                        setFormData({ ...formData, awards: newAwards });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="TechCorp Inc."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    value={award.date}
                    onChange={(e) => {
                      const newAwards = [...(formData.awards || [])];
                      newAwards[index].date = e.target.value;
                      setFormData({ ...formData, awards: newAwards });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="December 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={award.description}
                    onChange={(e) => {
                      const newAwards = [...(formData.awards || [])];
                      newAwards[index].description = e.target.value;
                      setFormData({ ...formData, awards: newAwards });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Recognized for outstanding performance and leadership in Q4"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Volunteer */}
      {optionalSections.volunteer && (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🤝 Volunteer Experience</h2>
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  volunteer: [...(formData.volunteer || []), getEmptyEntry('volunteer')],
                });
              }}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Volunteer Work
            </button>
          </div>
          {formData.volunteer?.map((vol, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Volunteer Work {index + 1}</h3>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      volunteer: formData.volunteer?.filter((_, i) => i !== index),
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization *
                    </label>
                    <input
                      type="text"
                      value={vol.organization}
                      onChange={(e) => {
                        const newVol = [...(formData.volunteer || [])];
                        newVol[index].organization = e.target.value;
                        setFormData({ ...formData, volunteer: newVol });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Local Food Bank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={vol.role}
                      onChange={(e) => {
                        const newVol = [...(formData.volunteer || [])];
                        newVol[index].role = e.target.value;
                        setFormData({ ...formData, volunteer: newVol });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Volunteer Coordinator"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="text"
                      value={vol.startDate}
                      onChange={(e) => {
                        const newVol = [...(formData.volunteer || [])];
                        newVol[index].startDate = e.target.value;
                        setFormData({ ...formData, volunteer: newVol });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="January 2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (or "Present")
                    </label>
                    <input
                      type="text"
                      value={vol.endDate}
                      onChange={(e) => {
                        const newVol = [...(formData.volunteer || [])];
                        newVol[index].endDate = e.target.value;
                        setFormData({ ...formData, volunteer: newVol });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description/Impact (one per line)
                  </label>
                  <textarea
                    value={vol.bullets?.join('\n')}
                    onChange={(e) => {
                      const newVol = [...(formData.volunteer || [])];
                      newVol[index].bullets = e.target.value.split('\n');
                      setFormData({ ...formData, volunteer: newVol });
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Coordinated food distribution for 500+ families monthly&#10;Managed team of 15 volunteers&#10;Implemented new inventory tracking system"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (one category per line) *
          </label>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Languages: JavaScript, TypeScript, Python, Java&#10;Frontend: React, Next.js, Vue.js, Tailwind CSS&#10;Backend: Node.js, Express, Django, FastAPI&#10;Databases: PostgreSQL, MongoDB, Redis&#10;Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD&#10;Tools: Git, Jest, Pytest, Linux"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: "Category: skill1, skill2, skill3" (one category per line)
          </p>
        </div>
      </section>

      {/* AI Refinement Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">🤖 AI-Powered Refinement</h2>
            <p className="text-sm text-gray-600">Optimize your resume for a specific job description using AI</p>
          </div>
          <button
            onClick={() => setUseAI(!useAI)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              useAI
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {useAI ? '✓ AI Enabled' : 'Enable AI'}
          </button>
        </div>

        {useAI && (
          <div className="space-y-3 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model *
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="deepseek-r1-distill-llama-70b">DeepSeek R1 Distill LLaMA 70B ⭐ Recommended</option>
                <option value="gpt-oss">GPT-OSS (20B)</option>
                <option value="mistral-large">Mistral Large</option>
                <option value="llama">LLaMA</option>
                <option value="qwen">Qwen</option>
                <option value="kimi">Kimi</option>
                <option value="k2">K2</option>
                <option value="minimax">MiniMax M2</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                💡 DeepSeek R1 Distill is recommended for best resume refinement quality
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are seeking a Senior Software Engineer with 5+ years of experience in full-stack development. The ideal candidate will have expertise in React, Node.js, and cloud platforms (AWS/GCP). You will lead the development of scalable web applications and mentor junior developers.&#10;&#10;Requirements:&#10;- 5+ years of software development experience&#10;- Strong proficiency in JavaScript/TypeScript&#10;- Experience with React, Node.js, and SQL databases&#10;- Cloud platform experience (AWS preferred)&#10;- Excellent problem-solving and communication skills"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 The AI will rewrite your bullet points to match this job description while keeping facts accurate
              </p>
            </div>
            
            {refining && (
              <div className="flex items-center gap-2 p-3 bg-indigo-100 rounded-md">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                <span className="text-sm text-indigo-700 font-medium">Refining resume with AI using {aiModel}...</span>
              </div>
            )}
          </div>
        )}

        {!useAI && (
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              ✨ <strong>Pro Tip:</strong> Enable AI refinement to automatically optimize your resume content for specific job postings. 
              The AI will rewrite your experience bullets and project descriptions to highlight relevant skills while maintaining factual accuracy.
            </p>
          </div>
        )}
      </section>

      {/* Format Selection & Generate */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Resume</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['txt', 'html', 'pdf', 'docx'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-3 rounded-md border-2 font-medium transition-all ${
                    format === f
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {f.toUpperCase()}
                  <div className="text-xs font-normal mt-1">
                    {f === 'txt' && 'Plain Text'}
                    {f === 'html' && 'Web Preview'}
                    {f === 'pdf' && 'PDF Document'}
                    {f === 'docx' && 'Word Doc'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateResume}
            disabled={loading || refining}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {refining 
              ? '🤖 Refining with AI...' 
              : loading 
                ? 'Generating Resume...' 
                : `Generate ${format.toUpperCase()} Resume${useAI && jobDescription.trim() ? ' (AI-Optimized)' : ''}`
            }
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {preview && format === 'txt' && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
              <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800 overflow-auto max-h-96">
                {preview}
              </pre>
            </div>
          )}

          {preview && (format === 'pdf' || format === 'docx') && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                {preview}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
