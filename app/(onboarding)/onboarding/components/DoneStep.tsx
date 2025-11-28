"use client";

import { Task } from "@/app/(dashboard)/dashboard/tasks/components/task";
import { useState } from "react";



export default function TaskRankingStep() {
    
    
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">All Set !</h2>
            <p className="text-gray-600 mb-6 text-center">Setting up your workspace... Hang tight.</p>

            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

}