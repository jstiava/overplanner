'use client'
import { OverplannerSessionContext, Panel } from "@/components/OverplannerSessionContext";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { RenderPanel } from "@/components/UserDynamicPanelsArea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CopyIcon, GripVerticalIcon, MinusIcon, XIcon } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import { PanelSize } from "react-resizable-panels";
import { Fragment } from "react/jsx-runtime";


export const OverplannerPanelContext = createContext<Panel>({
    id: "",
    type: 'preview',
    props: {},
    setProps: null
})

export default function ResizeableDraggablePanel(props: {
    panel: Panel,
    index: number
}) {


    const { addPanel, panels, setPanels, removePanel } = useContext(OverplannerSessionContext);

    const [panelProps, setPanelProps] = useState(props.panel.props ?? {});

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

    const contextValue = useMemo(
        () => ({
            ...props.panel,
            props: panelProps,
            setProps: setPanelProps
        }),
        [props.panel, panelProps]
    )


    if (!removePanel) {
        return null;
    }

    return (
        <Fragment>
            <OverplannerPanelContext.Provider
                value={contextValue}
            >


                <ResizablePanel
                    id={props.panel.id}
                    minSize={"16em"}
                    defaultSize={props.panel.sizeInPixels}
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
                                {/* <p className="text-xs">{props.panel.type}</p> */}
                            </div>
                            <div className="flex w-fit gap-0">

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-fit px-2"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        return;
                                    }}
                                // onClick={() => removePanel(panel.id)}
                                // disabled={panels.length === 1}
                                >
                                    <span className="text-[0.6rem]">TODAY</span>
                                </Button>
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
            </OverplannerPanelContext.Provider>
        </Fragment>
    );
}