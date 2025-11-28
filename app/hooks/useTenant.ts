'use client'
import { useEffect, useState } from "react";

export function useTenant() {
    const [tenant, setTenant] = useState<string | null>(null);

    useEffect(()=> {
        const hostname = window.location.hostname;
        const parts = hostname.split('.')

        if (hostname.includes('localhost')){
            if (parts.length > 1 && parts[0] !== 'localhost'){
                setTenant(parts[0])
            }
        }else if (parts.length >= 3) {
            setTenant(parts[0])
        }
    }, [])


    return tenant
}