'use client';

import { useState } from "react";
import WelcomeWorkspaceStep from './components/WelcomeWorkspaceStep';
import WorkStyleStep from './components/WorkStyleStep';
import TaskCategoriesStep from './components/TaskCategoriesStep';
import TaskRankingStep from './components/TaskRankingStep';
import SpecialContextStep from './components/SpecialContextStep';
import DoneStep from './components/DoneStep';
import PrioritizationPhilosophyStep from './components/PrioritizationPhilosophy';
import { useRouter } from "next/navigation";


export default function OnboardingPage() {

    const router = useRouter();
    const [step, setStep] = useState(0);

    // Store onboarding data progressively
    const [formData, setFormData] = useState({
        workspace_name : "",
        role: "",
        workStyle : "",
        preferredHours: { start: "", end: "" },
        recurringRules: [] as any[],
        taskCategories: [] as any[],
        taskRanking: [] as { id: number; rank: number }[],
        calendarIntergration: null as File | null,
        projects: [] as any[],
        glossary: "",

        // New fields for prioritization and context
        prioritizationPhilosophy: {choice: "", details: ""},
        urgencyDefinition: {choice: "", details: ""},
        importanceDefinition: {choice: "", details: ""},
    });

    const handleNext = (newData: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setStep(prev => prev + 1);
    }

    const handleBack = () => setStep(prev => prev - 1);

    const handleFinish =  async (newData: Partial<typeof formData>) => {
        const finalData = { ...formData , ...newData};
        setFormData(finalData);

        // Move to DoneStep immediately
        setStep(prev => prev + 1);


        try{
            // Here you can make an API call to save the onboarding data
            console.log("Final Onboarding Data:", finalData);
            // Example API call to save onboarding data
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(finalData),
                credentials: 'include', // Important: send cookies for auth 
            });

            if (!res.ok) {
                throw new Error('Failed to save onboarding data');
            } else {
                // Redirect or show a success message
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
                console.log("Onboarding Complete", finalData);
                 // Redirect to dashboard or another page
                router.push('/dashboard');
                
            }
        
        }catch(error) {
            console.error("Error during onboarding completion:", error);
            // Optionally handle error, e.g., show a notification
        }

        
    }

    // Define all steps components
    const steps = [
        <WelcomeWorkspaceStep 
            data = {formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <WorkStyleStep 
            data = {formData}
            onNext = {handleNext}
            onBack = {handleBack}
        />,

        <PrioritizationPhilosophyStep 
            data = {formData}
            onNext = {handleNext}
            onBack = {handleBack}
        />,
        
        <TaskCategoriesStep 
            data = {formData}
            onNext = {handleNext}
            onBack = {handleBack}
        />,
        <TaskRankingStep 
            data = {formData}
            onNext = {handleNext}
            onBack = {handleBack}
        />,
        <SpecialContextStep 
            data = {formData}
            onNext = {handleFinish} // Final save & move to DoneStep
            onBack = {handleBack}
        />,
        <DoneStep/>
    ];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <ProgressBar 
                currentStep={step} 
                totalSteps={steps.length} />
                {steps[step]}
        </div>
    )
}

type ProgressBarProps = {
    currentStep: number;
    totalSteps: number;
};

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">

            <div className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}