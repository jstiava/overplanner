'use server'

import { ResizablePanel } from "@/components/ui/resizable";
import UserDynamicPanelsArea from "@/components/UserDynamicPanelsArea";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { EventsService } from "@/lib/events/EventsService";
import { deriveServerSessionUser, getServerParamsAndSearchParams, ServerComponentChildren, TypicalServerProps } from "@/lib/helpers"

export type ProtectedCalendarParams = TypicalServerProps<{

}, {
    date?: string // YYYYMMDD
}>


export default async function ProtectedPageServerLayout(props: ProtectedCalendarParams & ServerComponentChildren) {

    const params = await getServerParamsAndSearchParams(props);
    const user = await deriveServerSessionUser();

    if (!user) {
        // TODO - redirect to a 404 
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-[grey]">Something went wrong.</p>
            </div>
        )
    }

    const activeCalendarsWithInnerEvents = await EventsService.getCalendarsForUser({
        user_id: user.id
    });

    return (
        <ResizablePanel defaultSize={75}>
            <div className="h-full min-h-0 w-full overflow-hidden">
                <UserDynamicPanelsArea />
            </div>
        </ResizablePanel>
    )

}