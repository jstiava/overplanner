// app/api/assets/move/route.ts

import { NextRequest, NextResponse } from "next/server";
import Drizzle from "@/lib/drizzle";
import { cookies } from "next/headers";
import getSessionUser from "@/lib/getUser";
import { createBatchCertificates, deleteCertificates, getCertificatesForEventInIdArray, getEvent } from "@/lib/events";


export type EventMoveOperationType = {
    assetIds: string[],
    destination: string,
    initial: string
}

export async function POST(req: NextRequest) {

    try {
        
        const { assetIds, destination, initial } = await req.json() as EventMoveOperationType
        const drizzle = await Drizzle.getInstance();

        const sessionId = (await cookies()).get("session")?.value;
        const theUser = await getSessionUser(sessionId)

        if (!theUser) {
            return NextResponse.json(
                { success: false, message: 'Not signed in.' },
                { status: 400 }
            );
        }


        if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
            return NextResponse.json(
                { error: "assetIds must be a non-empty array." },
                { status: 400 }
            );
        }

        if (!destination || typeof destination != 'string') {
            return NextResponse.json(
                { error: "Event destination must be a valid string." },
                { status: 400 }
            );
        }

        // Counts as an auth step.
        const initialFolder = await getEvent( initial );

        if (!initialFolder) {
            return NextResponse.json(
                { error: "Initial folder does not exist or you don't have access", result: initialFolder },
                { status: 400 }
            );
        }

        // Counts as an auth step.
        const targetFolder = await getEvent( destination );

        if (!targetFolder) {
            return NextResponse.json(
                { error: "Target folder does not exist or you don't have access", result: targetFolder },
                { status: 400 }
            );
        }

        const assets = await getCertificatesForEventInIdArray({
            eventIds: assetIds,
            target: initial
        })

        console.log(assets);

        const deleteOperation = await deleteCertificates({
            ids: assets.map((e : any) => e.id),
        })

        console.log(deleteOperation)

        const createOperation = await createBatchCertificates({
            childEventIds: assets.map((e : any) => e.child_event_id ?? "").filter((y : any) => y != ""),
            parentEventId: destination
        })

        return NextResponse.json({
            success: true,
            initialAssets: assets,
            deleteOperation,
            createOperation
        });


    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to move assets.",
            },
            { status: 500 }
        );
    }
}