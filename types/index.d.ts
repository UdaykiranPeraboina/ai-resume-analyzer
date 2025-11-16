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

// Puter Types
interface PuterUser {
  username: string;
  email?: string;
  [key: string]: any;
}

interface FSItem {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  modified?: number;
  [key: string]: any;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<{
    type: "text" | "file" | "image_url";
    text?: string;
    puter_path?: string;
    image_url?: string;
  }>;
}

interface PuterChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  [key: string]: any;
}

interface AIResponse {
  message: {
    content: string | Array<{text: string}> | any;
    role?: string;
  } | string;
  success?: boolean;
  error?: any;
  [key: string]: any;
}

interface KVItem {
  key: string;
  value?: string;
}
