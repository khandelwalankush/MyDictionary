export interface DataDictionaryEntry {
  id: string;
  fieldName: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'timestamp' | 'mixed';
  sensitivity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  maskingRecommendation: string;
  apiGroup: string;
  tags?: string[];
  example?: string; // For code font display
  alternativeNames?: string[];
  validationRules?: string[];
  complianceNotes?: string;
  lastUpdated?: string;
}

export type MaskingTechnique = "Encryption (AES-256)" | "Tokenization" | "Redaction" | "Hashing (SHA-256)" | "Date Truncation" | "Generalization" | "None";
