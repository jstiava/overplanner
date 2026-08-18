import { Certificates, OverplannerCertificateType, Users } from "@/schema";
import { and, eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import Drizzle from "../drizzle";
import { getNewCertificateTemplate } from "./Templates";

const { passkey, ...UsersTableWithoutPasskey } = getTableColumns(Users);

export class CertificatesService {

    static async getCertificatesForEventInIdArray({ eventIds, target }: {
        eventIds: string[],
        target: string
    }) {
        const drizzle = await Drizzle.getInstance();

        const data = await drizzle.db.select({
            ...getTableColumns(Certificates)
        })
            .from(Certificates)
            .where(
                and(
                    inArray(Certificates.child_event_id, eventIds),
                    eq(Certificates.event_id, target)
                )
            )

        return data;
    }

    static async getAllCertificatesForEvent(event_id: string) {

        const drizzle = await Drizzle.getInstance();

        const usersWithCertificate = await drizzle.db
            .select({
                ...UsersTableWithoutPasskey,
                certificate: getTableColumns(Certificates)
            })
            .from(Certificates)
            .leftJoin(Users, eq(Users.id, Certificates.user_id))
            .where(
                and(
                    eq(Certificates.child_event_id, event_id),
                    isNotNull(Certificates.user_id)
                )
            )

        return usersWithCertificate;

    }

    static async deleteCertificates({ ids }: {
        ids: string[]
    }) {
        const drizzle = await Drizzle.getInstance();

        const operation = await drizzle.db.delete(Certificates)
            .where(
                and(
                    inArray(Certificates.id, ids)
                )
            )

        return operation;
    }


    static async createBatchCertificates({ childEventIds, parentEventId }: {
        childEventIds: string[],
        parentEventId: string
    }) {
        const drizzle = await Drizzle.getInstance();

        const newCerts: OverplannerCertificateType[] = [];
        for (const childId of childEventIds) {
            newCerts.push({
                ...getNewCertificateTemplate(),
                event_id: parentEventId,
                child_event_id: childId,
                notes: "Created by move operation from another folder."
            })
        }

        const operation = await drizzle.db.insert(Certificates).values(newCerts);

        return operation;

    }


}