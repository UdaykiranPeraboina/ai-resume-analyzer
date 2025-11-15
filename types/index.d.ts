interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface FeedbackSection {
  score: number;
  tips: Tip[];
}

interface Feedback {
  overallScore: number;
  ATS: FeedbackSection;
  toneAndStyle: FeedbackSection;
  content: FeedbackSection;
  structure: FeedbackSection;
  skills: FeedbackSection;
}

interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}
