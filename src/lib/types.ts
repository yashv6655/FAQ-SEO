export interface FAQProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  topic?: string;
  product?: string;
  audience?: string;
  tone?: string;
  num_questions?: number;
  industry?: string;
  target_audience?: string;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  project_id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at: string;
}

export interface FAQGeneration {
  id: string;
  project_id: string;
  user_id: string;
  topic: string;
  product: string;
  audience: string;
  tone: string;
  num_questions: number;
  faqs: {
    question: string;
    answer: string;
  }[];
  jsonld: string;
  title?: string;
  meta_description?: string;
  notes?: string[];
  created_at: string;
}

export interface FAQGenerationRequest {
  topic: string;
  product: string;
  audience?: string;
  num_questions?: number;
  tone?: string;
  language?: string;
}

export interface FAQGenerationResponse {
  faqs: {
    question: string;
    answer: string;
  }[];
  jsonld: string;
  title: string;
  meta_description: string;
  notes: string[];
}