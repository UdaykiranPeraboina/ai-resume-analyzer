import React, { useState } from 'react';
import type { Route } from "./+types/upload";
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Resume - ResuBuild" },
    { name: "description", content: "Upload your resume for AI-powered analysis" },
  ];
}

const Upload = () => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusTest, setStatusTest] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };


    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       const form = e.currentTarget.closest('form');
       if (!form) 
            return;
       const formData = new FormData(form);
       const companyName = formData.get('company-name') as string;
       const jobTitle = formData.get('job-title') as string;
       const jobDescription = formData.get('job-description') as string;
        
       if (!file) return;
    };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section"> 
        <div className="page-heading py-16">
            <h1>Smart feedback for your dream job</h1>
            {isProcessing ? (
                <>
                <h2>{statusTest}</h2>
                <img src="/images/resume-scan.gif" alt="Processing" className="w-full"/>
                </>
            ):(
                <h2>Drop your resume for ATS score and improvement tips</h2>
            )}
           {!isProcessing && (
            <form id="uploadForm" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input type="text" name="company-name" id="company-name" placeholder="Company Name"/>
                </div>
                <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input type="text" name="job-title" id="job-title" placeholder="Job Title"/>
                </div>
                 <div className="form-div">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea rows={5} name="job-description" id="job-description" placeholder="Job Description"/>
                </div>
                 <div className="form-div">
                    <label htmlFor="uploader">Upload Resume</label>
                    <FileUploader onFileSelect={handleFileSelect}/>
                </div>

                <button className="primary-button" type='submit'>Analyze Resume</button>

            </form>
           )}

        </div>
        </section> 
      </main>
  );
};

export default Upload;