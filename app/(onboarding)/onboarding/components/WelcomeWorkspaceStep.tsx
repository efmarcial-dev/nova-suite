'use client';
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, BriefcaseBusiness } from 'lucide-react';

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
        <div className="max-w-3xl">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F6FF] text-[#0088EE]">
                    <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">Welcome to Nova</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">Let&apos;s personalize your workspace so your assistant starts with the right context.</p>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
            <div>
                <label htmlFor="workspace-name" className="mb-2 block text-sm font-semibold text-slate-800">Workspace name</label>
                <input
                    id="workspace-name"
                    type="text"
                    value={workspace_name}
                    onChange={(e) => setworkspace_name(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1EA0FF] focus:ring-4 focus:ring-[#E8F6FF]"
                    placeholder="e.g. Acme Studio"
                />
            </div>

            <div>
                <label htmlFor="workspace-role" className="mb-2 block text-sm font-semibold text-slate-800">Your role</label>
                <div className="relative">
                <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    id="workspace-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1EA0FF] focus:ring-4 focus:ring-[#E8F6FF]"
                    placeholder="e.g. Founder, Operations lead"
                />
                </div>
            </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                <button type="button" onClick={onBack} disabled={!onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:invisible">
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                    type="button"
                    onClick={() => onNext({workspace_name, role})}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1EA0FF] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0088EE] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!workspace_name.trim() || !role.trim()}
                >
                    Continue <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
