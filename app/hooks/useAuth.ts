'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthCookies, redirectToLogin } from "../lib/auth";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/user')
            if (response.ok){
                const userData = await response.json()
                setUser(userData);
            }else {
                setUser(null);
            }
        }catch(error){
            console.error('Error in useAuth.ts api')
            setUser(null);
        }finally {
            setLoading(false);
        }
    }

    const logout = () => {
        clearAuthCookies()
        redirectToLogin()
    }

    return {user, loading, logout, refetch: checkAuth}
}