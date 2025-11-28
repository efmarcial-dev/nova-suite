"use client";
import { redirect } from "next/navigation";
import { use, useEffect } from "react";
export default async function LogOutPage() {
    
    useEffect(() => {
        // This will run on the client side
        async function logout() {
            await fetch('/api/logout', {
                method: 'POST',
            });
            // After logout, redirect to home page
            redirect('/');
        }
        logout();
    }, []);
    
    // While logging out, you can show a loading state
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Logging out...</p>
            {/* You can add a spinner or loading indicator here */}

        </div>
    );

}