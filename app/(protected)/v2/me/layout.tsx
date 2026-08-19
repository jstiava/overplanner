'use server'

import OverplannerSessionContextComponent from "@/components/OverplannerSessionContext";
import { ThemeProvider } from "@/components/theme-provider";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { EventsService } from "@/lib/events/EventsService";
import { deriveServerSessionUser, getServerParamsAndSearchParams, ServerComponentChildren, TypicalServerProps } from "@/lib/helpers"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import UserSidebar from "@/components/UserSidebar";
import UserDynamicPanelsArea from "@/components/UserDynamicPanelsArea";

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

    const eventsForUser = await EventsService.getCalendarsForUser({
        user_id: user.id
    })

    return (
        <ThemeProvider
            attribute="class"
            forcedTheme={'dark'}
        >
            <OverplannerSessionContextComponent
                {...{
                    user,
                    session: null,
                    events: eventsForUser
                }}
            >
                <div className="flex w-screen h-screen p-0">
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="h-screen w-full overflow-hidden"
                    >

                        {/* Sidebar */}
                        <ResizablePanel
                            id="sidebar"
                            defaultSize={"20em"}
                            minSize={"14em"}
                            maxSize={"24em"}
                            collapsible
                            collapsedSize={0}
                        >
                            <UserSidebar />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {props.children}

                    </ResizablePanelGroup>
                </div>
            </OverplannerSessionContextComponent>
        </ThemeProvider>
    )

}