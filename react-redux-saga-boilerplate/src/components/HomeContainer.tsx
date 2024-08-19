import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: number;
  userId: string;
  title: string;
  description: string;
  location_name: string;
  salary: string;
  dateOfPost: string;
  category_name: string;
  skills: string;
  lastDate: string;
  country: string;
  education: string;
  skill_names: string;
}

interface HomeContainerProps {
  login: boolean;
  userDetails: object;
}

const LoginPromptModal: React.FC<{ show: boolean; handleClose: () => void }> = ({
  show,
  handleClose,
}) => {
  let navigate = useNavigate();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please Login/Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to be logged in to apply for jobs.</p>
        <Button className="m-2" variant="primary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            navigate('/login');
          }}
        >
          Log in
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const HomeContainer: React.FC<HomeContainerProps> = ({ userDetails, login }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobSkills, setJobSkillsSearch] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [categories, setCategories] = useState<
    { id: string; categoryName: string; count: number }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/joblisting'); // Replace with your API endpoint
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/category/listCategories'); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchJobs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const applyJobHandler = (jobId: number) => {
    if (login) {
      navigate(`/viewdetails/${jobId}`, { state: { userDetails } });
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewMoreJobs = () => {
    setShowAllJobs(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = jobs.filter(
      job =>
        (jobSkills === '' ||
          job.skill_names.join(',').toLowerCase().includes(jobSkills.toLowerCase())) &&
        (locationSearch === '' ||
          job.location_name.toLowerCase().includes(locationSearch.toLowerCase())) &&
        (categorySearch === '' ||
          job.category_name.toLowerCase().includes(categorySearch.toLowerCase())),
    );
    setFilteredJobs(filtered);
  };

  const handleReset = () => {
    setJobSkillsSearch('');
    setLocationSearch('');
    setCategorySearch('');
    setFilteredJobs(jobs);
  };

  const handleCategoryClick = (category: string) => {
    setCategorySearch(category);
    const filtered = jobs.filter(job => job.category_name.toLowerCase() === category.toLowerCase());
    setFilteredJobs(filtered);
  };

  return (
    <div className="homepage-container pt-5 mt-5">
      <div className="container">
        <div className="jumbotron mt-5">
          <h1 className="display-4">Find Job</h1>
          <p className="lead">Search jobs by skill, location, and category.</p>

          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group col-md-4">
                <input
                  type="text"
                  className="form-control"
                  id="inputSkill"
                  placeholder="Skill"
                  value={jobSkills}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setJobSkillsSearch(e.target.value)
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <input
                  type="text"
                  className="form-control"
                  id="inputLocation"
                  placeholder="Location"
                  value={locationSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch(e.target.value)
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <select
                  id="inputCategory"
                  className="form-control"
                  value={categorySearch}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCategorySearch(e.target.value)
                  }
                >
                  <option value="">Choose Category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <Button variant="secondary" onClick={handleReset} className="ml-2">
              Reset
            </Button>
          </form>
        </div>
        <div className="row m-5">
          <div className="col-md-12">
            <h2 className="text-center mb-4 text-dark">Explore by Categories</h2>
          </div>
          {categories.map(category => (
            <div className="col-md-3 my-3" key={category.id}>
              <div
                className="card bg-dark text-white"
                onClick={() => handleCategoryClick(category.categoryName)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <h5 className="card-title">{category.categoryName}</h5>
                  <p className="card-text">Total Jobs: {category.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="text-center mb-4 text-dark">Featured Jobs</h2>
          </div>
          {filteredJobs.slice(0, showAllJobs ? filteredJobs.length : 9).map(job => (
            <div className="col-md-4 mb-4" key={job.id}>
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title text-dark">
                    <strong>{job.title}</strong>
                  </h3>
                  <p className="card-text text-dark">Category : {job.category_name}</p>
                  <p className="card-text text-dark">
                    Location : {job.location_name} , {job.country}
                  </p>
                  <p className="card-text text-dark">Salary : {job.salary} LPA</p>
                  <p className="card-text text-dark">Date Posted : {formatDate(job.dateOfPost)}</p>
                  <button onClick={() => applyJobHandler(job.id)} className="btn btn-primary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAllJobs && filteredJobs.length > 9 && (
          <div className="text-center mt-4">
            <Button onClick={handleViewMoreJobs} className="btn btn-primary">
              View More Jobs
            </Button>
          </div>
        )}
      </div>
      <LoginPromptModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default HomeContainer;
