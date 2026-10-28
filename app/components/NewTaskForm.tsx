'use client';

import React, { useState, useRef} from "react";
import DatePicker from 'react-datepicker';
import {format} from 'date-fns';
import TagInput from "./TagInput";
import {X, CalendarPlus, CloudUpload, Plus} from 'lucide-react'
import NewProjectForm from "./NewProjectForm";
import { createTask, rescoreTaskAPI } from "../lib/api/tasks";
import { useCachedTasks } from "../hooks/useCachedTasks";
import { updateTaskInCache } from "../lib/cache/NovaCacheHelpers";
import { emitTaskChangeEvent } from "../lib/events/novaEvents";
import ProjectSelect from "./ProjectSelect";
import StatusSelect from "./StatusSelect";



interface NewTaskFormProps {
    projects: any[];
    onSubmitSuccess?: () => void;
    setHasPills?: (value: boolean) => void;
}

export default function NewTaskForm({
    projects,
    onSubmitSuccess,
    setHasPills

}: NewTaskFormProps) {
    
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const [project, setProject] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [errors, setErrors] = useState<{tags?: string}>({});

    const [activeView, setActiveView] = useState<'task' | 'add_project'>('task');

    const datePickerRef = useRef<any>(null);

    const { addTaskToCache } = useCachedTasks();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const created = await createTask({
                title,
                status,
                selectedProjectId,
                tags,
                dueDate,
                description,
                attachment,
            });

            const unwrapped = (created as any)?.task ?? created;
            const validTask = {
                ...unwrapped,
                id: unwrapped?.id || `local-${Date.now()}`,
                title: unwrapped?.title || title,
                status: unwrapped?.status || status || 'todo',
                project: unwrapped?.project ?? selectedProjectId,
                tags: unwrapped?.tags ?? tags,
                due_date: unwrapped?.due_date ?? (dueDate ? format(dueDate, 'yyyy-MM-dd') : ''),
                // Preserve AI score fields returned from backend on creation
                confidence: unwrapped?.confidence ?? unwrapped?.score ?? 0,
                score: unwrapped?.score ?? unwrapped?.confidence ?? 0,
                reasoning: unwrapped?.reasoning ?? unwrapped?.scoring_explanation ?? '',
                lastUpdated: Date.now(),
            };

            // Add to cache database
            await addTaskToCache(validTask);

            // Emit task change event so TaskBoard and all components update instantly
            emitTaskChangeEvent({ action: 'create', task: validTask });

            // Reset form or call parent close
            onSubmitSuccess?.();

            // Fire-and-forget background rescore: backend already scored on create()
            // but we trigger a fresh Groq LLM rescore in the background once we have the real ID.
            // This updates confidence/reasoning in cache without blocking the user.
            const realId = validTask.id;
            if (realId && !String(realId).startsWith('local-')) {
                rescoreTaskAPI(realId).then((rescored) => {
                    if (rescored) {
                        updateTaskInCache(rescored);
                        emitTaskChangeEvent({ action: 'update', task: rescored });
                    }
                }).catch(() => {
                    // Silent — rescore is best-effort, local score is already shown
                });
            }
        } catch(err) {
            console.error('Failed to create task', err)
            alert("Failed to save task");
        } finally {
            setLoading(false);
        }
    }
    


    return (

        <div className="flex flex-col h-full relative overflow-y-auto ">

            <div 
                className="w-full h-full transition-transform duration-300 flex"
                style={{ transform: activeView === 'add_project' ? 'translateX(-100%)' : 'translateX(0)' }}
            >

                {/* New task form (original contnent) */}
                <div className="w-full shrink-0 pr-4">

                    <form className="space-y-4 pb-6" onSubmit={handleSubmit}>
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter task title"
                                />
                            </div>

                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <StatusSelect value={status} onChange={setStatus} />
                            </div>

                            <div className="relative">
                                <label htmlFor="" className="block text-sm font-medium mb-1">Project</label>
                                <ProjectSelect
                                        projects={projects}
                                        selectedProjectId={selectedProjectId}
                                        setSelectedProjectId={setSelectedProjectId}
                                        onAddProject={()=> setActiveView('add_project')}
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-2 gap-4">
                            <TagInput 
                                value={tags}
                                onChange={setTags}
                                required
                                error={errors.tags}
                            />

                            <div>
                                <label htmlFor="" className="block text-sm font-medium mb-1">Due Date</label>
                                <div className="relative">
                                    <div className="relative">
                                        <DatePicker
                                        ref={datePickerRef }
                                        selected={dueDate}
                                        onChange={(date) => {setDueDate(date);setIsDatePickerOpen(false) }}
                                        onClickOutside={() => setIsDatePickerOpen(false)}
                                        open={isDatePickerOpen}
                                        placeholderText="Select a date"
                                        className="w-full border border-gray-300 rounded-md p-2 pr-10"
                                        popperPlacement="bottom-start"
                                        popperClassName="z-50"
                                    
                                    />
                                    <span
                                        onClick={() => setIsDatePickerOpen(true)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer pointer-events-auto"
                                        >
                                        <CalendarPlus className="text-gray-300 hover:bg-gray-200 transition" />
                                    </span>
                                    </div>
                                    {dueDate && (
                                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-full w-fit">
                                        {format(dueDate, 'PPP')}
                                        <X size={14} className="cursor-pointer" onClick={() => {setDueDate(null); setIsDatePickerOpen(false)}} />
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 4 */}
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

                        
                    {/* Footer Buttons */}
                    <div className="sticky bottom-0 left-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                                onClick={onSubmitSuccess} // or your close logic
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                    </div>


            </form>

                </div>


                {/* New Project form */}
                <div className="w-full shrink-0 pl-4">
                    <NewProjectForm 
                        onSave={(newProjectName) => {
                            setProject(newProjectName); // set projet field
                            setActiveView('task'); // return to main form
                        }}
                        onCancel={() => setActiveView('task')}
                    />
                </div>

            </div>

            
            

        </div>
        
    )

}