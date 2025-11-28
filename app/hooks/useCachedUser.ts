"use client";

import { useEffect, useState } from "react";
import { getCachedUser, saveUserToCache } from "../lib/cache/NovaCacheHelpers";
import { fetchUserAPI } from "../lib/api/user";

export function useCachedUser() {
    const [user, setUser] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const cachedUser = await getCachedUser();

            if (isMounted && cachedUser.length > 0) {
                setUser(cachedUser);
                setFromCache(true);
                setIsLoading(false);
                console.log('Found user in cache');

            } else {
                try {

                    console.log("Calling User API and updating cache");
                    const freshUser = await fetchUserAPI();
                    console.log('Fetched user from API:', freshUser);
                    const userArray = Array.isArray(freshUser) ? freshUser : [freshUser];
                    const withTimestamps = userArray.map(u => ({
                        ...u,
                        last_updated: Date.now()}))
                    await saveUserToCache(withTimestamps);

                    if (isMounted) {
                        setUser(withTimestamps);
                        setFromCache(false);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { user, isLoading, fromCache };
}