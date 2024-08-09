import { useState, useEffect } from 'react';

function DashBoardCards() {
  const [totalJobListings, setTotalJobListings] = useState<number | null>(null);
  const [totalAppliedUsers, setTotalAppliedUsers] = useState<number | null>(null);
  const [activeJobsCount, setActiveJobsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalAppliedUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appliedjobs/totalappliedusers');
        const data = await response.json();
        if (response.ok) {
          setTotalAppliedUsers(data.totalUsersApplied);
        } else {
          console.error('Failed to fetch total applied users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching total applied users:', error);
      }
    };
    fetchTotalAppliedUsers();
  }, []);
  useEffect(() => {
    const fetchJobListingsCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/totalcount');
        const data = await response.json();
        if (response.ok) {
          setTotalJobListings(data.count);
        } else {
          console.error('Failed to fetch job listings count:', data.error);
        }
      } catch (error) {
        console.error('Error fetching job listings count:', error);
      }
    };
    fetchJobListingsCount();
  }, []);

  useEffect(() => {
    const fetchActiveJobsCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/activejobs/count');
        const data = await response.json();
        if (response.ok) {
          setActiveJobsCount(data.count);
        } else {
          console.error('Failed to fetch active jobs count:', data.error);
        }
      } catch (error) {
        console.error('Error fetching active jobs count:', error);
      }
    };
    fetchActiveJobsCount();
  }, []);

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Job Listings</h5>
            <p className="card-text">
              {totalJobListings !== null ? totalJobListings : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Users</h5>
            <p className="card-text">
              {' '}
              {totalAppliedUsers !== null ? totalAppliedUsers : 'Loading...'}
            </p>{' '}
            {/* Replace with actual user count */}
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Active Jobs</h5>
            <p className="card-text">
              {activeJobsCount !== null ? activeJobsCount : 'Loading...'}
            </p>{' '}
            {/* Replace with actual active job count */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardCards;
