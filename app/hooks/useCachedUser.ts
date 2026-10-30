"use client";

import { useEffect, useState } from "react";
import { getCachedUser, saveUserToCache } from "../lib/cache/NovaCacheHelpers";
import { fetchUserAPI } from "../lib/api/user";
import { getCurrentUser, getTenant } from "../lib/getTenant";

export function useCachedUser() {
    const [user, setUser] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            let cachedUser: any[] = [];
            try {
                cachedUser = await getCachedUser();
            } catch (cacheError) {
                console.warn('Could not read the local user cache; loading from the API.', cacheError);
            }

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
                    void saveUserToCache(withTimestamps).catch((cacheError) => {
                        console.warn('Could not save the user cache.', cacheError);
                    });

                    if (isMounted) {
                        setUser(withTimestamps);
                        setFromCache(false);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    if (isMounted) setIsLoading(false);
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
