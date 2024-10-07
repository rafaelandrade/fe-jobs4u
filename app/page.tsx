'use client'

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, Pagination } from '@mui/material';


export default function Home() {
    const [keyword, setKeyword] = useState<string>('');
    const [keywordsList, setKeywordsList] = useState<string[]>([]);
    const [location, setLocation] = useState<string>('');
    const [jobs, setJobs] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const jobsPerPage = 4;
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const countries = [
        { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
        { code: 'US', name: 'USA', flag: '🇺🇸' },
        { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
        { code: 'GER', name: 'Germany', flag: '🇩🇪' },
        { code: 'FRA', name: 'France', flag: '🇫🇷' },
        { code: 'UK', name: 'UK', flag: '🇬🇧' },
    ];

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && keyword.trim()) {
            if (keywordsList.length < 5) {
                setKeywordsList([...keywordsList, keyword.trim()]);
                setKeyword(''); // Clear the input after adding
            }
            e.preventDefault(); // Prevent form submission on Enter
        }
    };

    const removeKeyword = (index: number) => {
        const newKeywordsList = [...keywordsList];
        newKeywordsList.splice(index, 1);
        setKeywordsList(newKeywordsList);
    };

    const handleSearch = async () => {
        console.log('Searching for Jobs with:', { keywordsList, location });
        const response = await fetch("http://localhost:8000/jobs/find", {
            method: "POST",
            body: JSON.stringify({ keywords: keywordsList, location: location.toLowerCase() }),
            headers: { "Content-Type": "application/json" }
        });

        const jobData = await response.json();
        console.log('response -> ', jobData);

        // Set jobs data and hide search form
        setJobs(jobData);
        setIsSearching(true);
        setCurrentPage(1); // Reset to the first page
    };

    const handleReset = () => {
        // Reset states to show search form again
        setKeyword('');
        setKeywordsList([]);
        setLocation('');
        setJobs([]);
        setIsSearching(false);
        setCurrentPage(1); // Reset to the first page
    };

    // Calculate current jobs to display
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    // Handle pagination
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Handle dialog open
    const handleOpenDialog = (job: any) => {
        setSelectedJob(job);
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedJob(null);
    };

    // Handle apply button click (now redirects to the job URL)
    const handleApplyClick = () => {
        if (selectedJob) {
            // Redirect to the job application URL
            window.open(selectedJob.url, '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!isSearching ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-indigo-600">Jobs4U.io</h1>
                        <p className="text-gray-600 mt-2">Find jobs that fit you, globally!</p>
                    </div>
                    <div className="space-y-4">
                        {/* Keywords Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keywords</label>
                            <div className="flex items-center flex-wrap border p-2 rounded bg-gray-50 mt-1 space-x-2">
                                {/* Display keywords inline */}
                                {keywordsList.map((word, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded-full"
                                    >
                                        <span>{word}</span>
                                        <button
                                            onClick={() => removeKeyword(index)}
                                            className="ml-2 text-xs text-gray-200 hover:text-red-400"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={
                                        keywordsList.length === 0 ? 'Enter keywords (e.g., Javascript, Python)' : ''
                                    }
                                    className="flex-grow outline-none text-black bg-transparent p-1"
                                />
                            </div>
                        </div>

                        {/* Country Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full border p-2 text-black rounded bg-gray-50 mt-1"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-indigo-600">Jobs4U.io</h1>
                        <p className="text-gray-600 mt-2">Find jobs that fit you, globally!</p>
                    </div>
                    <h2 className="text-gray-600 text-2xl font-bold mb-4">Job Listings</h2>
                    {currentJobs.length === 0 ? (
                        <p>No jobs found. Please try different keywords or location.</p>
                    ) : (
                        <Grid container spacing={2}>
                            {currentJobs.map((job, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <div className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
                                        <h3 className="text-gray-600 text-xl font-semibold">{job.title}</h3>
                                        <p className="text-gray-600">{job.company}</p>
                                        <p className="text-gray-500">{job.location}</p>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleOpenDialog(job)}
                                            className="mt-2"
                                        >
                                            View Description
                                        </Button>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Pagination Controls */}
                    <Pagination
                        count={Math.ceil(jobs.length / jobsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        className="mt-4"
                    />

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        New Search
                    </button>
                </div>
            )}

            {/* Job Description Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedJob?.title}</DialogTitle>
                <DialogContent>
                    <p>{selectedJob?.description}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleApplyClick} color="primary">
                        Apply
                    </Button>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}