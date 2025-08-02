"use client";
import { useEffect } from "react";

export function useAuthRefresh() {
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            try {

                const res = await fetch('/api/refresh', {
                    method: 'GET',
                    credentials: 'include', // Ensure cookies are sent with the request
                });

                if (!res.ok) {
                    console.warn("Failed to refresh auth token:", res.statusText);
                } else {
                    console.log("Auth token refreshed successfully");
                }

            } catch (error) {
                console.error("Error refreshing auth token:", error);
            }
        }, 1000 * 60 * 14); // Refresh every 14 minutes

        return () => clearInterval(refreshInterval);
    }, [])
}