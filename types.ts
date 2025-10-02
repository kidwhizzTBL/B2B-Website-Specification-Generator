
export interface WebsiteSection {
  id: number;
  title: string;
  description: string;
}

export interface SpecFormData {
  clientName: string;
  industry: string;
  objectives: string[];
  targetAudience: string;
  sections: WebsiteSection[];
  techRequirements: string[];
  designAesthetic: string;
}
