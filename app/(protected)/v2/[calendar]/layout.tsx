'use server'

import OverplannerCalendarContextComponent from "@/components/OverplannerCalendarContext";
import OverplannerSessionContextComponent from "@/components/OverplannerSessionContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { EventsService } from "@/lib/events/EventsService";
import { deriveServerSessionUser, getServerParamsAndSearchParams, ServerComponentChildren, TypicalServerProps } from "@/lib/helpers"
import { Events } from "@/schema";

export type ProtectedCalendarParams = TypicalServerProps<{
    calendar: string
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

    if (!params.calendar) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p className="text-[grey]">Something went wrong.</p>
            </div>
        )
    }

    const calendarWithCertificate = await EventsService.getEventWithUserCertificate(params.calendar, user.id);

    if (!calendarWithCertificate) {
        // TODO - redirect to a 404 
        return (
            <div className="flex items-center justify-center w-full h-full">
                <p>Could not find the calendar.</p>
            </div>
        )
    }

    if (!calendarWithCertificate.start_timezone) {
        // TODO - redirect to a 404 
        return (
            <p>Calendar has no set time zone.</p>
        )
    }

    const targetDate = new OverplannerDate("now", calendarWithCertificate.start_timezone);


    return (
        <ThemeProvider
            attribute="class"
            forcedTheme={'dark'}
        >
            <OverplannerSessionContextComponent
                {...{
                    user,
                    session: null
                }}
            >
                <OverplannerCalendarContextComponent
                    {...{
                        calendar: calendarWithCertificate as any
                    }}
                >
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="rounded-lg border w-full"
                    >
                        <ResizablePanel  id="sidebar" defaultSize="25%" minSize={"14em"} maxSize={"400px"} collapsible={true} collapsedSize={0} className="h-full">
                            {props.children}
                        </ResizablePanel>
                        <ResizablePanel defaultSize="75%">
                            <div className="flex w-full min-h-screen">
                                {props.children}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </OverplannerCalendarContextComponent>
            </OverplannerSessionContextComponent>
        </ThemeProvider>
    )

}