import Drizzle from '@/lib/drizzle';
import { Certificates, Events, OverplannerCertificateType, OverplannerEventType, OverplannerEventViewType, OverplannerSessionType, OverplannerUserType, POSTGRES_ERROR_CODES, Users } from '@/schema';
import dayjs from 'dayjs';
import { and, eq, gte, lt, inArray, lte, getTableColumns, isNotNull, or, gt, sql, isNull } from 'drizzle-orm';
import Papa from 'papaparse';


export function getNewEventTemplate(): OverplannerEventType {

    const keys = Object.keys({} as OverplannerEventType) as (keyof OverplannerEventType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = 'placeholder'

    return initial

}


export function getNewUserTemplate(): OverplannerUserType {

    const keys = Object.keys({} as OverplannerUserType) as (keyof OverplannerUserType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = 'placeholder'

    return initial

}

export function getNewCertificateTemplate(): OverplannerCertificateType {

    const keys = Object.keys({} as OverplannerCertificateType) as (keyof OverplannerCertificateType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = generateUUID()

    return initial

}

export function getNewSessionTemplateWithId(): OverplannerSessionType {

    const keys = Object.keys({} as OverplannerSessionType) as (keyof OverplannerSessionType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = generateUUID()

    return initial

}

export function generateUUID(): string {
    return crypto.randomUUID()
}