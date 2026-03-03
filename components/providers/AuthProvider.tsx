'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {Billing, Organization, Profile} from "@/types/handled";
import {useToast} from "@/hooks/use-toast";
import { toast } from "sonner"
import {OrganizationInsert} from "@/types/db";
import {OnboardingData} from "@/app/onboarding/page";


interface AuthContextType {
    user: User | null;
    userLoading: boolean;
    profileLoading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    resendVerification: (email: string) => Promise<{ error: Error | null }>;
    completeOnboarding: (onboradingData: OnboardingData) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    profile: Profile | null;
    updateProfile: (profileUpdate: Partial<Profile>) => Promise<{ error: Error | null }>;
    organization: Organization | null;

    billing: Billing | null;


}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null)
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [userLoading, setUserLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);
    const [organizationLoading, setOrganizationLoading] = useState(true);



    const router = useRouter();


    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        if(!user || !supabase) {return;}

        async function getProfile(){
            if(!user) {return;}

            setProfileLoading(true)
            const {data: profileData, error: profileError} =
                await supabase.from("profiles")
                    .select("*").eq("id", user.id)
                    .maybeSingle();




            if (profileError) {
                toast.error(profileError.message);
                setProfileLoading(false)
                return;
            }
            setProfileLoading(false)
            setProfile(profileData as Profile)

        }

        getProfile();

    }, [user, supabase]);
    useEffect(() => {
        if (!user || !profile || !profile?.org_id) {return};


        async function getOrganization(){
            if (!user || !profile || !profile?.org_id) {return};

            setOrganizationLoading(true);
            const {data: organData, error: organError} =
                await supabase.from("organizations")
                    .select("*").eq("id", profile.org_id)
                    .single();

            if (organError) {
                toast.error(organError.message);
                setOrganizationLoading(false)
                return;
            }

            setOrganizationLoading(false)
            setOrganization(organData as Organization);

        }

        getOrganization();


    }, [profile, user]);
    // useEffect(() => {
    //     if(!user || !profile) { return}
    //
    //
    //
    // }, [user, profile]);
    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) return;

            const nextUser = session?.user ?? null;

            setUser(nextUser);
            setUserLoading(false);
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const nextUser = session?.user ?? null;

            setUser(nextUser);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                toast.error(error.message);
                console.error(error.message);
                throw error;
            }


            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };
    async function resendVerification(email: string) {
        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                },
            });

            if (error) {
                toast.error(error.message);
                console.error(error.message);
                throw error;
            }

            toast.success("Verification email sent again.");
            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }

    }
    const signUp = async (email: string, password: string, name: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                },
            });

            if (error) {
                toast.error(error.message);
                console.error(error.message);
                throw error;

            }

            const user = data.user;

            if (!user) return { error: null };

            await fetch("/api/onboarding/profile", {
                method: "POST",
                body: JSON.stringify({
                    name
                })
            })

            return { error: null };

        } catch (error) {
            return { error: error as Error };
        }
    };


    const completeOnboarding = async (onboardingData: OnboardingData) => {
       try {
           const res = await fetch(`/api/onboarding/setup/`, {
               method: "POST",
               body: JSON.stringify({
                   onboardingData
               })
           })

           const telephoneRes = await fetch(`/api/telephony/provision-number`, {
               method: "POST",
               body: JSON.stringify({
                   onboardingData
               })
           })

           return {error: null}
       } catch (error) {
           return { error: error as Error };
       }


    }

    const updateProfile = async (profileData: Partial<Profile>) => {
        try {
            const res = await fetch(`/api/profile/update/`, {
                method: "POST",
                body: JSON.stringify({
                    profileData
                })
            })

            return {error: null}
        } catch (error) {
            return { error: error as Error };
        }


    }



    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, userLoading, profileLoading, signIn, signOut, signUp, resendVerification, profile, completeOnboarding, organization, updateProfile}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
