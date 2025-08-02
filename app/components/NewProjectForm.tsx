'use client';

import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { createProject } from '../lib/api/projects';
import { useCachedProjects } from '../hooks/useCachedProjects';

export default function NewProjectForm({
  onSave,
  onCancel,
}: {
  onSave: (projectName: string) => void;
  onCancel: () => void;
}) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const {isProjectLoading, addProjectToCache } = useCachedProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    
    try {


      const newProject = await createProject({
        projectName,
        description,
        status: 'pending'
      })

      console.log('New project created:', newProject);

      await addProjectToCache(newProject);

      if (projectName.trim()) {
            onSave(projectName.trim());
        }

    }catch(error) {
      console.error('Error creating project:', error);
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">

      <form
        className="space-y-4 pb-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
              <label htmlFor="" className="block text-sm font-medium mb-1">Description</label>
              <textarea 
               className="w-full rounded-md border border-gray-300 rounded-mb p-2 h-28"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
          </div>

        {/* Row 5 */}
        <div>
           <label className="block text-sm font-medium mb-2">Attachment</label>
                            <div
                            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
                            onClick={() => document.getElementById('fileInput')?.click()}
                            >
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                                <CloudUpload />
                                <p>
                                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">PDF, TXT, JPEG, XLSX up to 100MB</p>
                            </div>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                            />
                            </div>
                            {attachment && (
                            <p className="mt-2 text-sm text-green-600">Selected: {attachment.name}</p>
                            )}
          </div>

        <div className="sticky bottom-0 left-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
