'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import WelcomeWorkspaceStep from './components/WelcomeWorkspaceStep';
import WorkStyleStep from './components/WorkStyleStep';
import PrioritizationPhilosophyStep from './components/PrioritizationPhilosophy';
import TaskCategoriesStep from './components/TaskCategoriesStep';
import TaskRankingStep from './components/TaskRankingStep';
import ProviderSetupStep from './components/ProviderSetupStep';
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
        <ProviderSetupStep
            key="providers"
            onNext={() => handleNext()}
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
    const setupStepTitles = [
        'Workspace',
        'Work style',
        'Priorities',
        'Task categories',
        'Task examples',
        'Connect accounts',
        'Product tour',
        'Activate access',
    ];
    const isSetupComplete = currentStepIndex >= setupStepTitles.length;

    return (
        <div className="mx-auto max-w-5xl">
            {!isSetupComplete && (
                <>
                    <div className="mb-7 max-w-2xl">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                            Personalize Nova
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Let&apos;s set up your workspace
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            A few quick choices will help tailor Nova to the way you work.
                        </p>
                    </div>
                    <ProgressBar
                        currentStep={currentStepIndex}
                        totalSteps={setupStepTitles.length}
                        titles={setupStepTitles}
                    />
                </>
            )}
            <div className={`mx-auto max-w-4xl ${isSetupComplete ? '' : 'pt-7 sm:pt-9'}`}>
                {steps[currentStepIndex]}
            </div>
        </div>
    );
}

type ProgressBarProps = {
    currentStep: number;
    totalSteps: number;
    titles: string[];
};

function ProgressBar({ currentStep, totalSteps, titles }: ProgressBarProps) {
    const progress = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));
    return (
        <div className="border-y border-slate-200/80 py-4">
            <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-slate-900">{titles[currentStep]}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Step {currentStep + 1} of {totalSteps}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">{progress}% complete</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5" aria-label={`Onboarding progress: step ${currentStep + 1} of ${totalSteps}`}>
                {titles.map((title, index) => (
                    <div
                        key={title}
                        aria-hidden="true"
                        className={`h-1.5 rounded-full transition-colors duration-300 ${index <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    />
                ))}
            </div>
        </div>
    );
}
