import { NextRequest, NextResponse } from 'next/server';
import { Events, POSTGRES_ERROR_CODES } from '@/schema';
import { and, eq, gte, lt } from 'drizzle-orm';
import Drizzle from '@/lib/drizzle';

export async function DELETE(req: NextRequest, ctx: RouteContext<any>) {

    const drizzle = await Drizzle.getInstance();
    
    
    try {
        const { id } = await ctx.params

        if (!id) {
            return NextResponse.json(
                {error: "No event id provided."},
                {status: 500}
            )
        }

        // Example: delete from DB (replace with your logic)
        // await db.events.delete({ where: { id: eventId } });

        await drizzle.db.delete(Events).where(
            eq(Events.id, id)
        )

        return NextResponse.json(
            { success: true, id: id },
            { status: 200 }
        );

    } catch (err) {
        
        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        );
    }

}