import { NextResponse, type NextRequest } from 'next/server'
import {createServerClient} from "@supabase/ssr";
import {createSupabaseServerClient} from "@/lib/supabase/server";

import {Profile} from "./types/handled"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();


  const res = NextResponse.next();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup')
  const isAppPage = request.nextUrl.pathname.startsWith('/app')
  const isOnboarding = request.nextUrl.pathname.startsWith('/onboarding')

  if (!user && (isAppPage || isOnboarding)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && (isAppPage || isOnboarding)) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .maybeSingle()  ;



    if (isAppPage && !profile?.org_id){
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    if (isOnboarding && profile?.org_id){
      return NextResponse.redirect(new URL('/app', request.url))

    }

  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
