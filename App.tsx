
import React, { useState } from 'react';
import { SpecFormData } from './types';
import Header from './components/Header';
import SpecForm from './components/SpecForm';
import SpecOutput from './components/SpecOutput';
import Loader from './components/Loader';
import { generateWebsiteSpec } from './services/geminiService';

// Pre-populated data from the user's prompt
const initialFormData: SpecFormData = {
  clientName: "Dubai Strategy Partners",
  industry: "Boutique business setup and strategy consultancy",
  objectives: [
    "Lead Generation: Capture contact details of potential business clients.",
    "Establish Credibility: Position the firm as a trusted, expert authority.",
    "Educate Visitors: Provide valuable information about setting up a business in Dubai."
  ],
  targetAudience: "International entrepreneurs, existing UAE SMEs, and foreign companies exploring UAE market entry.",
  sections: [
    { id: 1, title: 'Homepage', description: 'A professional hero section with a clear value proposition (e.g., "Your Expert Partner for Business Success in the UAE"). Include trust signals like "As seen in..." or client logos.' },
    { id: 2, title: 'Our Services', description: 'A detailed breakdown of offerings (e.g., Mainland Company Formation, Free Zone Setup, Corporate Banking Assistance). Each service should have its own page.' },
    { id: 3, title: 'Why Dubai?', description: "An informational section that 'sells' Dubai as a business hub, providing value to the visitor." },
    { id: 4, title: 'Case Studies/Client Success', description: 'A portfolio showcasing successful projects and client testimonials.' },
    { id: 5, title: 'Insights/Blog', description: 'Expert articles on topics like "Choosing the Right Free Zone" or "UAE Corporate Tax Explained".' },
    { id: 6, title: 'About Us', description: 'Bios of the key partners, company mission, and values.' },
    { id: 7, title: 'Contact Us', description: 'A prominent "Request a Free Consultation" call-to-action, a detailed contact form, office address, and phone number.' }
  ],
  techRequirements: [
    "Clean, corporate, and trustworthy design aesthetic.",
    "Mobile-first, responsive layout.",
    "Fast page load speeds.",
    "Integration with a CRM (like HubSpot or Zoho) for lead management."
  ],
  designAesthetic: "Clean, corporate, trustworthy, modern, premium."
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<SpecFormData>(initialFormData);
  const [generatedSpec, setGeneratedSpec] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedSpec('');
    try {
      const spec = await generateWebsiteSpec(formData);
      setGeneratedSpec(spec);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SpecForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading} />
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Generated Specification</h2>
            {isLoading && <Loader />}
            {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
            {generatedSpec && !isLoading && <SpecOutput spec={generatedSpec} />}
            {!isLoading && !error && !generatedSpec && (
              <div className="flex-grow flex items-center justify-center text-center text-gray-500">
                <p>Your generated website specification will appear here once you submit the form.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
