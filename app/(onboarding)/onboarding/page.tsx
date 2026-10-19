'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import WelcomeWorkspaceStep from './components/WelcomeWorkspaceStep';
import WorkStyleStep from './components/WorkStyleStep';
import PrioritizationPhilosophyStep from './components/PrioritizationPhilosophy';
import TaskCategoriesStep from './components/TaskCategoriesStep';
import TaskRankingStep from './components/TaskRankingStep';
import SpecialContextStep from './components/SpecialContextStep';
import TutorialStep from './components/TutorialStep';
import SubscribeStep from './components/SubscribeStep';
import DoneStep from './components/DoneStep';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    // Store onboarding data progressively
    const [formData, setFormData] = useState({
        workspace_name: "",
        role: "",
        workStyle: "",
        preferredHours: { start: "", end: "" },
        recurringRules: [] as any[],
        taskCategories: [] as any[],
        taskRanking: [] as { id: number; rank: number }[],
        calendarIntergration: null as File | null,
        projects: [] as any[],
        glossary: "",

        // Prioritization and context
        prioritizationPhilosophy: { choice: "", details: "" },
        urgencyDefinition: { choice: "", details: "" },
        importanceDefinition: { choice: "", details: "" },
    });

    const handleNext = (newData?: Partial<typeof formData>) => {
        if (newData) {
            setFormData(prev => ({ ...prev, ...newData }));
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => Math.max(0, prev - 1));

    // Save preferences from SpecialContextStep and advance to TutorialStep
    const handleSavePreferences = async (newData: Partial<typeof formData>) => {
        const finalData = { ...formData, ...newData };
        setFormData(finalData);

        try {
            console.log("Saving onboarding preferences:", finalData);
            await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
                credentials: 'include',
            });
        } catch (error) {
            console.error("Error during preferences save:", error);
        }

        // Advance to Tutorial step
        setStep(prev => prev + 1);
    };

    // Define all steps components
    const steps = [
        <WelcomeWorkspaceStep
            key="welcome"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <WorkStyleStep
            key="workstyle"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <PrioritizationPhilosophyStep
            key="philosophy"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <TaskCategoriesStep
            key="categories"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <TaskRankingStep
            key="ranking"
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <SpecialContextStep
            key="context"
            data={formData}
            onNext={handleSavePreferences}
            onBack={handleBack}
        />,
        <TutorialStep
            key="tutorial"
            onNext={() => setStep(prev => prev + 1)}
            onBack={handleBack}
        />,
        <SubscribeStep
            key="subscribe"
            onNext={() => setStep(prev => prev + 1)}
            onBack={handleBack}
        />,
        <DoneStep key="done" />
    ];

    const currentStepIndex = Math.min(step, steps.length - 1);

    return (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-[--border] shadow-xs my-6">
            <ProgressBar
                currentStep={currentStepIndex}
                totalSteps={steps.length}
            />
            {steps[currentStepIndex]}
        </div>
    );
}

type ProgressBarProps = {
    currentStep: number;
    totalSteps: number;
};

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{progress}% Completed</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}