'use client'
import { OverplannerSessionContext, Panel } from "@/components/OverplannerSessionContext";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { RenderPanel } from "@/components/UserDynamicPanelsArea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CopyIcon, GripVerticalIcon, MinusIcon, XIcon } from "lucide-react";
import { useContext } from "react";
import { Fragment } from "react/jsx-runtime";

export default function ResizeableDraggablePanel(props: {
    panel: Panel,
    index: number
}) {


    const { addPanel, panels, removePanel } = useContext(OverplannerSessionContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.panel.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (!removePanel) {
        return null;
    }

    return (
        <Fragment>
            <ResizablePanel
                minSize={"16em"}
                defaultSize={100 / panels.length}
                maxSize={props.panel.type == 'day-view' ? '32em' : undefined}
                className="h-full"
                elementRef={setNodeRef}
                style={style}
                {...attributes}

            >
                <div className="relative flex flex-col w-full h-full"
                >

                    {/* HEADER */}
                    <div className=" z-10 flex justify-between w-full top-0 left-0 bg-[#101010cc] h-[1.5rem] hover:bg-muted "  {...listeners}>
                        <div className="flex w-fit h-full items-center px-2">
                            <p className="text-xs">{props.panel.type}</p>
                        </div>
                        <div className="flex w-fit gap-0">

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                            // onClick={() => removePanel(panel.id)}
                            // disabled={panels.length === 1}
                            >
                                <CopyIcon className="h-2 w-2" />
                                <span className="sr-only">
                                    Duplicate panel
                                </span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removePanel(props.panel.id)}
                                disabled={panels.length === 1}
                            >
                                <MinusIcon className="h-2 w-2" />
                                <span className="sr-only">
                                    Minimize panel
                                </span>
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removePanel(props.panel.id)}
                                disabled={panels.length === 1}
                            >
                                <XIcon className="h-2 w-2" />
                                <span className="sr-only">
                                    Close panel
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* PANEL */}
                    <div className="min-h-0 flex-1 overflow-hidden h-[calc(100%-1.5rem)]">
                        <RenderPanel {...props.panel} />
                    </div>


                </div>
            </ResizablePanel>

            {props.index < panels.length - 1 && (
                <ResizableHandle withHandle />
            )}
        </Fragment>
    );
}