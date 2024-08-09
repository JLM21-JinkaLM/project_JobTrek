import React, { useState, useEffect } from 'react';

export interface JobDetails {
  id?: string;
  title: string;
  description: string;
  location_id: string;
  salary: string;
  skills_id: string;
  category_id: string;
  dateOfPost: string;
  lastDate: string;
  education: string;
  experience: string;
  jobtype: string;
}

export interface Skill {
  id: number;
  skillName: string;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface Location {
  id: number;
  location_name: string;
  country: string;
}

interface JobFormProps {
  onSubmit: (jobDetails: JobDetails, resetForm: () => void) => void;
  initialJob?: JobDetails;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, initialJob }) => {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    id: initialJob?.id || '',
    title: initialJob?.title || '',
    description: initialJob?.description || '',
    location_id: initialJob?.location_id || '',
    salary: initialJob?.salary || '',
    skills_id: initialJob?.skills_id || '',
    category_id: initialJob?.category_id || '',
    dateOfPost: initialJob?.dateOfPost || '',
    lastDate: initialJob?.lastDate || '',
    education: initialJob?.education || '',
    experience: initialJob?.experience || '',
    jobtype: initialJob?.jobtype || '',
  });

  const [errors, setErrors] = useState<Partial<JobDetails>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills/skills');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setSkills(data.skills);
            // Update selectedSkills based on initialJob.skills_id
            if (initialJob?.skills_id) {
              // Split the skills_id string into an array of skill names
              const initialSelectedSkills = initialJob.skill_names
                .split(',')
                .map(skill => skill.trim()); // Trim each skill to remove extra whitespace

              setSelectedSkills(initialSelectedSkills);
            }
          } else {
            console.error('Failed to fetch skills:', data.msg);
          }
        } else {
          console.error('Expected JSON response but got:', contentType);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/category/categories');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setCategories(data.categories);
          } else {
            console.error('Failed to fetch categories:', data.msg);
          }
        } else {
          console.error('Expected JSON response but got:', contentType);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/location/locations');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            setLocations(data.locations);
          } else {
            console.error('Failed to fetch locations:', data.msg);
          }
        } else {
          console.error('Expected JSON response but got:', contentType);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchSkills();
    fetchCategories();
    fetchLocations();
  }, [initialJob]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'skills_id') {
      const selectedSkill = skills.find(skill => skill.id === parseInt(value));
      console.log(selectedSkill );
      
      if (selectedSkill && !selectedSkills.includes(selectedSkill.skillName)) {
        setSelectedSkills(prevSkills => [...prevSkills, selectedSkill.skillName]);
      }
    } else {
      setJobDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills(prevSkills => prevSkills.filter(skill => skill !== skillName));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const updatedJobDetails = {
        ...jobDetails,
        skills_id: selectedSkills,
      };
      onSubmit(updatedJobDetails, resetForm);
      console.log('kkkkkkk', update);
    }
  };

  const validate = () => {
    const newErrors: Partial<JobDetails> = {};

    if (!jobDetails.title.trim()) newErrors.title = 'Job title is required';
    if (!jobDetails.description.trim()) newErrors.description = 'Job description is required';
    if (!jobDetails.location_id) newErrors.location_id = 'Job location is required';
    if (!jobDetails.salary.trim()) newErrors.salary = 'Salary is required';
    if (selectedSkills.length === 0) newErrors.skills_id = 'Skills are required';
    if (!jobDetails.category_id) newErrors.category_id = 'Category is required';

    const currentDate = new Date().toISOString().split('T')[0];
    if (!jobDetails.dateOfPost || jobDetails.dateOfPost > currentDate) {
      newErrors.dateOfPost = 'Invalid date of post';
    }
    if (!jobDetails.lastDate || jobDetails.lastDate < currentDate) {
      newErrors.lastDate = 'Invalid last date';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setJobDetails({
      id: '',
      title: '',
      description: '',
      location_id: '',
      salary: '',
      skills_id: '',
      category_id: '',
      dateOfPost: '',
      lastDate: '',
      education: '',
      experience: '',
      jobtype: '',
    });
    setSelectedSkills([]);
    setErrors({});
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2>{initialJob ? 'Edit Job' : 'Post a Job'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="mt-4">
                {/* Job Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleChange}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Enter job title"
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* Job Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={jobDetails.description}
                    onChange={handleChange}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows={3}
                    placeholder="Enter job description"
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                {/* Salary */}
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={jobDetails.salary}
                    onChange={handleChange}
                    className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                    placeholder="Enter salary"
                  />
                  {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label htmlFor="location_id" className="form-label">
                    Location
                  </label>
                  <select
                    id="location_id"
                    name="location_id"
                    value={jobDetails.location_id}
                    onChange={handleChange}
                    className={`form-control ${errors.location_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                  {errors.location_id && (
                    <div className="invalid-feedback">{errors.location_id}</div>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <label htmlFor="skills_id" className="form-label">
                    Skills
                  </label>
                  <select
                    id="skills_id"
                    name="skills_id"
                    onChange={handleChange}
                    className={`form-control ${errors.skills_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select skill</option>
                    {skills.map(skill => (
                      <option key={skill.id} value={skill.id}>
                        {skill.skillName}
                      </option>
                    ))}
                  </select>
                  {errors.skills_id && <div className="invalid-feedback">{errors.skills_id}</div>}
                </div>

                {/* Display Selected Skills */}
                <div className="mb-3">
                  <label className="form-label">Selected Skills</label>
                  <ul className="list-group">
                    {selectedSkills.map(skill => (
                      <li
                        key={skill.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label htmlFor="category_id" className="form-label">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={jobDetails.category_id}
                    onChange={handleChange}
                    className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <div className="invalid-feedback">{errors.category_id}</div>
                  )}
                </div>

                {/* Date of Post */}
                <div className="mb-3">
                  <label htmlFor="dateOfPost" className="form-label">
                    Date of Post
                  </label>
                  <input
                    type="date"
                    id="dateOfPost"
                    name="dateOfPost"
                    value={jobDetails.dateOfPost}
                    onChange={handleChange}
                    className={`form-control ${errors.dateOfPost ? 'is-invalid' : ''}`}
                  />
                  {errors.dateOfPost && <div className="invalid-feedback">{errors.dateOfPost}</div>}
                </div>

                {/* Last Date */}
                <div className="mb-3">
                  <label htmlFor="lastDate" className="form-label">
                    Last Date
                  </label>
                  <input
                    type="date"
                    id="lastDate"
                    name="lastDate"
                    value={jobDetails.lastDate}
                    onChange={handleChange}
                    className={`form-control ${errors.lastDate ? 'is-invalid' : ''}`}
                  />
                  {errors.lastDate && <div className="invalid-feedback">{errors.lastDate}</div>}
                </div>

                {/* Education */}
                <div className="mb-3">
                  <label htmlFor="education" className="form-label">
                    Education
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={jobDetails.education}
                    onChange={handleChange}
                    className={`form-control ${errors.education ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select education</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.Com">B.Com</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                  {errors.education && <div className="invalid-feedback">{errors.education}</div>}
                </div>

                {/* Experience */}
                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">
                    Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={jobDetails.experience}
                    onChange={handleChange}
                    className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 Years</option>
                    <option value="1-2">1-2 Years</option>
                    <option value="2-3">2-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5+">5+ Years</option>
                  </select>
                  {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                </div>

                {/* Job Type */}
                <div className="mb-3">
                  <label htmlFor="jobtype" className="form-label">
                    Job Type
                  </label>
                  <select
                    id="jobtype"
                    name="jobtype"
                    value={jobDetails.jobtype}
                    onChange={handleChange}
                    className={`form-control ${errors.jobtype ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select job type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                  {errors.jobtype && <div className="invalid-feedback">{errors.jobtype}</div>}
                </div>

                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    {initialJob ? 'Update Job' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
