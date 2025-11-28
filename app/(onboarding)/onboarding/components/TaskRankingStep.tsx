"use client";

import { useState } from "react";

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
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Example Task Ranking</h2>
            <p className="mb-4">For each task, choose how you would prioritize it. This gives the AI concrete examples</p>

            {sampleTasks.map((task) => (
                <div key={task.id} className="border p-3 rounded mb-3">
                    <div  className="font-semibold">{task.title}</div>
                    <div className="text-sm text-gray-500">Urgency: {task.urgency} | Importance: {task.importance}</div>
                    <div className="mt-2 flex gap-3">
                        {["Do Now", "Do Later", "Delegate", "Don't Do"].map((option, index) => (
                            <label key={option} className="flex items-center gap-1">
                                <input 
                                    type="radio"
                                    name={`task-${task.id}`}
                                    value={option}
                                    
                                    checked={taskRanking.find((r) => r.id === task.id)?.rank === index + 1}
                                    onChange={() => setRank(task.id, index + 1)}
                                    className="mr-2"
                                />
                            </label>
                        ))}
                    </div>
                </div>
            ))};

            <div className="flex justify-between">
                <button onClick={onBack} className="px-4 py-2 border rounded">Back</button>
                <button
                    onClick={() => onNext({ taskRanking })}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={taskRanking.length < sampleTasks.length}
                >
                    Next
                </button>
            </div>
        </div>
    )

}