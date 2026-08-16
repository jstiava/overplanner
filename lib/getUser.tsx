import { Sessions, Users } from "@/schema";
import { eq } from "drizzle-orm";
import Drizzle from "@/lib/drizzle";

export default async function getSessionUser(sessionId: string | undefined) {
    const drizzle = await Drizzle.getInstance();

    if (!sessionId) {
        return null
    }

    const [theSession] = await drizzle.db.select().from(Sessions).where(
            eq(Sessions.id, sessionId)
        ).limit(1)

        if (!theSession) {
            return null
        }

        const [theUser] = await drizzle.db.select().from(Users).where(
            eq(Users.id, theSession.user_id)
        )

        const { passkey, ...theUserWithoutPasskey } = theUser;

        return theUserWithoutPasskey
}