import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Job from './Job';
import { SERVER_URL } from '@/utils/constant';

function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${SERVER_URL}/saved-jobs`);
                if (res.data.success) {
                    setSavedJobs(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch saved jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading saved jobs...</div>;
    }

    if (savedJobs.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">You haven't saved any jobs yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map(job => (
                <div key={job._id}>
                    <Job job={job} />
                </div>
            ))}
        </div>
    );
}

export default SavedJobs;
