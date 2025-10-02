import React from 'react';
import { SpecFormData } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SpecFormProps {
  formData: SpecFormData;
  setFormData: React.Dispatch<React.SetStateAction<SpecFormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const SpecForm: React.FC<SpecFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {

  const handleInputChange = <K extends keyof SpecFormData,>(field: K, value: SpecFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    handleInputChange('objectives', newObjectives);
  };

  const addObjective = () => {
    handleInputChange('objectives', [...formData.objectives, '']);
  };

  const removeObjective = (index: number) => {
    handleInputChange('objectives', formData.objectives.filter((_, i) => i !== index));
  };

  const handleSectionChange = (id: number, field: 'title' | 'description', value: string) => {
    const newSections = formData.sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    );
    handleInputChange('sections', newSections);
  };
  
  const addSection = () => {
    const newId = formData.sections.length > 0 ? Math.max(...formData.sections.map(s => s.id)) + 1 : 1;
    handleInputChange('sections', [...formData.sections, { id: newId, title: '', description: '' }]);
  };

  const removeSection = (id: number) => {
    handleInputChange('sections', formData.sections.filter(section => section.id !== id));
  };


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Client Requirements</h2>
      <form onSubmit={(e) => {e.preventDefault(); onSubmit();}} className="space-y-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
          <input
            type="text"
            id="clientName"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input
            type="text"
            id="industry"
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Business Objectives</h3>
          <div className="space-y-2">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Objective #${index + 1}`}
                />
                <button type="button" onClick={() => removeObjective(index)} className="p-2 text-gray-400 hover:text-red-500 flex-shrink-0">
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button type="button" onClick={addObjective} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium pt-2">
                <PlusIcon />
                Add Objective
            </button>
          </div>
        </div>
         <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <textarea
            id="targetAudience"
            rows={3}
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Website Sections</h3>
          <div className="space-y-4">
            {formData.sections.map((section, index) => (
              <div key={section.id} className="p-4 border rounded-md bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`section-title-${section.id}`} className="block text-xs font-medium text-gray-600">Title</label>
                        <input
                            type="text"
                            id={`section-title-${section.id}`}
                            value={section.title}
                            onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor={`section-desc-${section.id}`} className="block text-xs font-medium text-gray-600">Description</label>
                        <textarea
                            id={`section-desc-${section.id}`}
                            rows={2}
                            value={section.description}
                            onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
                 <button type="button" onClick={() => removeSection(section.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500">
                    <TrashIcon />
                </button>
              </div>
            ))}
             <button type="button" onClick={addSection} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                <PlusIcon />
                Add Section
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Specification'}
        </button>
      </form>
    </div>
  );
};

export default SpecForm;