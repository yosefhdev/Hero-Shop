import { useState, useEffect } from 'react';
import supabase from '../supabase/client'

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setIsAuthenticated(!!session);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { isAuthenticated, isLoading };
};