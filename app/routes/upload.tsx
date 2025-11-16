import React, { useState, useEffect } from 'react';
import type { Route } from "./+types/upload";
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from "react-router";
import { convertPdfToImage } from '~/lib/utils/pdfToImage';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Resume - ResuBuild" },
    { name: "description", content: "Upload your resume for AI-powered analysis" },
  ];
}

const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusTest, setStatusTest] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!auth.isAuthenticated && !isLoading) {
            navigate('/auth?next=/upload');
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };


    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {companyName: string; jobTitle: string; jobDescription: string; file: File | null}) => {
        if (!file) {
            setStatusTest("Please select a file first.");
            return;
        }
        
        try {
            setIsProcessing(true);
            setStatusTest("Uploading your resume...");
            const uploadFile = await fs.upload([file]);

            if (!uploadFile) {
                setStatusTest("Failed to upload resume. Please try again.");
                setIsProcessing(false);
                return;
            }
        
            setStatusTest("Converting PDF to image...");
            const imageFile = await convertPdfToImage(file);

            if (!imageFile.file) {
                setStatusTest("Failed to process resume. Please try again.");
                setIsProcessing(false);
                return;
            }

            setStatusTest("Uploading resume image...");
            const uploadImage = await fs.upload([imageFile.file]);
            
            if (!uploadImage) {
                setStatusTest("Failed to upload resume image. Please try again.");
                setIsProcessing(false);
                return;
            }

            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadFile.path,
                imagePath: uploadImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: ''
            }
            
            await kv.set(`resume-${uuid}`, JSON.stringify(data));

            setStatusTest("Generating AI feedback...");
            
            // Use the feedback method which properly formats the request for Puter AI
            const feedback = await ai.feedback(
                uploadImage.path,
                prepareInstructions({jobTitle, jobDescription})
            );

            if (!feedback) {
                setStatusTest("Failed to analyze resume.");
                setIsProcessing(false);
                return;
            }

            // Handle the response format
            let feedbackText = '';
            if (typeof feedback.message === "string") {
                feedbackText = feedback.message;
            } else if (feedback.message && typeof feedback.message === 'object') {
                if ('content' in feedback.message) {
                    const content = feedback.message.content;
                    if (Array.isArray(content)) {
                        feedbackText = content[0]?.text || content[0] || '';
                    } else if (typeof content === 'string') {
                        feedbackText = content;
                    }
                } else if ('text' in feedback.message) {
                    feedbackText = (feedback.message as any).text;
                }
            }

            if (!feedbackText) {
                setStatusTest("Failed to parse AI response.");
                setIsProcessing(false);
                return;
            }

            // Parse the JSON feedback
            try {
                data.feedback = JSON.parse(feedbackText);
            } catch (parseError) {
                console.error('Failed to parse feedback JSON:', parseError);
                console.log('Raw feedback text:', feedbackText);
                setStatusTest("Failed to parse AI feedback. Please try again.");
                setIsProcessing(false);
                return;
            }
            
            await kv.set(`resume-${uuid}`, JSON.stringify(data));
            
            setStatusTest("Analysis complete! Redirecting...");
            console.log('Analysis complete:', data);
            navigate(`/resume/${uuid}`);
            
            // Redirect to home or results page after 2 seconds
            setTimeout(() => {
                setIsProcessing(false);
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error('Error during analysis:', error);
            setStatusTest(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!file) {
            setStatusTest("Please upload a resume file.");
            return;
        }
        
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;
        
        if (!companyName || !jobTitle || !jobDescription) {
            setStatusTest("Please fill in all fields.");
            return;
        }
        
        handleAnalyze({companyName, jobTitle, jobDescription, file});
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
                <img src="/images/resume-scan.gif" alt="Processing" className="w-full max-w-md mx-auto"/>
                </>
            ):(
                <h2>Drop your resume for ATS score and improvement tips</h2>
            )}
            
            {!isProcessing && statusTest && !statusTest.includes('complete') && (
                <p className="text-red-500 mt-4">{statusTest}</p>
            )}
            
           {!isProcessing && (
            <form id="uploadForm" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                <div className="form-div">
                    <label htmlFor="company-name">Company Name *</label>
                    <input 
                        type="text" 
                        name="company-name" 
                        id="company-name" 
                        placeholder="Company Name"
                        required
                    />
                </div>
                <div className="form-div">
                    <label htmlFor="job-title">Job Title *</label>
                    <input 
                        type="text" 
                        name="job-title" 
                        id="job-title" 
                        placeholder="Job Title"
                        required
                    />
                </div>
                 <div className="form-div">
                    <label htmlFor="job-description">Job Description *</label>
                    <textarea 
                        rows={5} 
                        name="job-description" 
                        id="job-description" 
                        placeholder="Job Description"
                        required
                    />
                </div>
                 <div className="form-div">
                    <label htmlFor="uploader">Upload Resume *</label>
                    <FileUploader onFileSelect={handleFileSelect}/>
                </div>

                <button 
                    className="primary-button" 
                    type='submit'
                    disabled={!file}
                >
                    Analyze Resume
                </button>

            </form>
           )}

        </div>
        </section> 
      </main>
  );
};

export default Upload;