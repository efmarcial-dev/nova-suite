"use client";

import { useEffect, useState } from "react";
import { getCachedAssigneesWithMetadata, saveAssigneesToCache} from "../lib/cache/NovaCacheHelpers";
import { fetchAssigneeAPI } from "../lib/api/assignee";


const CACHE_EXPIRY_MS = 1000 * 60 * 5; // 5 minutes

export function useCachedAssigneees() {
    const [assignees, setAssignees] = useState<any[]>([]);
    const [isAssigneeLoading, setIsLoading] = useState(true);
    const [fromCache, setFromCache] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const {assignees: cached, last_updated} = await getCachedAssigneesWithMetadata();
            const now = Date.now();
            const isStale = now - last_updated > CACHE_EXPIRY_MS;

            if (isMounted && cached.length > 0){
                setAssignees(cached);
                setFromCache(true);
                setIsLoading(false);
                console.log('Found Assigees in Cache')
            }

            if(cached.length === 0 || isStale) {
                try{

                    console.log("Calling Assignee API and updating Cache");
                    const fresh = await fetchAssigneeAPI();
                    const withTimestamps = fresh.map(assignee => ({
                        ...assignee,
                        last_updated: Date.now()
                    }));

                    await saveAssigneesToCache(withTimestamps);

                    if(isMounted) {
                        setAssignees(withTimestamps);
                        setFromCache(false);
                        setIsLoading(false);
                    }

                }catch(error){
                    console.log(error);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        }
    }, [])

    return {assignees, isAssigneeLoading, fromCache}
}