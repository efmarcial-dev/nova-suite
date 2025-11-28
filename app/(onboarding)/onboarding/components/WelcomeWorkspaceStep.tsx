'use client';
import { useState } from "react";

type WelcomeWorkspaceStepProps = {
    data: {
        workspace_name?: string;
        role?: string;
    };
    onNext: (data: { workspace_name: string; role: string }) => void;
    onBack?: () => void;
};

export default function WelcomeWorkspaceStep({ data, onNext, onBack }: WelcomeWorkspaceStepProps) {
    const [workspace_name, setworkspace_name] = useState(data.workspace_name || "");
    const [role, setRole]  = useState(data.role || "");


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Nova!</h2>
            <p className="mb-6">Let's get started by setting up your workspace so your AI assitant can be personalized from day one.</p>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Workspace Name</label>
                <input
                    type="text"
                    value={workspace_name}
                    onChange={(e) => setworkspace_name(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your workspace name"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Role</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your role in the workspace"
                />
            </div>

            <button
                onClick={() => onNext({workspace_name, role})}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!workspace_name || !role}
            >
                Next
            </button>
        </div>
    )
}