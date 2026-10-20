"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Flag } from 'lucide-react';

type TaskRank = {
    id: number;
    rank: number;
};

type TaskRankingStep = {
    data: {
        taskRanking: TaskRank[];
    };
    onNext: (data: { taskRanking: TaskRank[] }) => void;
    onBack?: () => void;
};

export default function TaskRankingStep({data, onNext, onBack}: TaskRankingStep) {

    const sampleTasks = [
        { id: 1, title: "Reply to client email", urgency: "Medium", importance: "High" },
        { id: 2, title: "Prepare weekly report", urgency: "Low", importance: "High" },
        { id: 3, title: "Fix production bug", urgency: "High", importance: "High" },
        { id: 4, title: "Organize files", urgency: "Low", importance: "Low" }
    ];

    const [taskRanking, setTaskRankking] = useState<TaskRank[]>(data.taskRanking || []);

    const setRank = (taskId: number, rank: number) => {
        setTaskRankking((prev) => {
            const other = prev.filter((r) => r.id !== taskId);
            return [...other, { id: taskId, rank }];
        })
    }
    
    const options = ['Do now', 'Do later', 'Delegate', "Don't do"];

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">Show Nova how you rank tasks</h2>
                <p className="mt-1 text-sm text-slate-500">Choose what you would do with each example. There are no wrong answers.</p>
            </div>

            <div className="space-y-3">
                {sampleTasks.map((task) => (
                    <fieldset key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                        <legend className="sr-only">How would you prioritize: {task.title}?</legend>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800"><Clock3 className="h-3 w-3" />{task.urgency} urgency</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-800"><Flag className="h-3 w-3" />{task.importance} impact</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {options.map((option, index) => {
                                const rank = index + 1;
                                const selected = taskRanking.find((item) => item.id === task.id)?.rank === rank;
                                return (
                                    <label key={option} className={`flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-medium transition ${selected ? 'border-indigo-400 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                                        <input className="sr-only" type="radio" name={`task-${task.id}`} value={rank} checked={selected} onChange={() => setRank(task.id, rank)} />
                                        {selected && <Check className="h-3.5 w-3.5 text-indigo-600" />}{option}
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button
                    type="button"
                    onClick={() => onNext({ taskRanking })}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={taskRanking.length < sampleTasks.length}
                >
                    Continue <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

}
