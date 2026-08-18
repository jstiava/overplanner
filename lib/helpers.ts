import getSessionUser from "@/lib/getUser";
import { OverplannerUserPublicType } from "@/schema";
import { cookies } from "next/headers";
import { JSX, ReactNode } from "react";

/**
 * On a given url, params and searchParams would be supplied.
 */
export type TypicalServerProps<A, B> = {
    params: Promise<A>;
    searchParams: Promise<B>;
}

export type ServerComponentChildren = {
    children: ReactNode
}


/**
 * Awaits and returns param and searchParams values together in a single json variable.
 * @param props 
 * @returns 
 */
export async function getServerParamsAndSearchParams<A, B>(props: TypicalServerProps<A, B>): Promise<A & B> {
    const paramsData = await props.params
    const searchParamsData = await props.searchParams

    return { ...paramsData, ...searchParamsData }
}


/**
 * On the server side or client side, look in cookies, find session id, and lookup the session and user.
 * @returns 
 */
export async function deriveServerSessionUser(): Promise<OverplannerUserPublicType | null> {
    const sessionId = (await cookies()).get("session")?.value;

    if (!sessionId) {
        return null;
    }
    const theUser = await getSessionUser(sessionId)
    return theUser;
}
