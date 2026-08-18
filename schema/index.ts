import { relations, sql } from "drizzle-orm";
import { decimal, varchar, integer, boolean, text, unique, timestamp, date, time, pgEnum, uuid, pgTable, json, jsonb, numeric } from "drizzle-orm/pg-core";

// import { defineRelations } from 'drizzle-orm';

export const BookingTypeEnum = pgEnum("booking_type", [
    "one_time",
    "all_day",
    'single_all_day',
    "multi_day",
    "multi_day_specific_times"
]);

export const EventCreationKingEnum = pgEnum("creation_kind", [
    "user",
    "history",
    "system"
])

export const POSTGRES_ERROR_CODES = {
    DUPLICATE_ROW: "23505"
}


/**
 * 
 * Events.type
 * 1. All Day
 * 2. One time
 * 3. Multi day
 * 4. Multi day specific times
 * 
 * 
 * Events.mode
 * 1. Todo
 * 2. Counter
 * 3. Goal pointer
 * 4. Distance progress
 * 5. Time progress
 * 6. Travel
 * 7. Location
 * 
 */

/**
 * Certificate permission roles:
 * 1. 
 */
type EventTheme = {
    mode: "light" | "dark";
    primaryColor: string;
    borderRadius: number;
};

type EventTypesType = "calendar" | "pair" | "all_day" | "single_all_day" | "all_month" | "single_time" | "todo" | "select" | "booking_space" | "select_modifier"

export const Events = pgTable('events', {
    id: varchar({ length: 128 }).primaryKey().notNull(),
    type: varchar({ length: 50 }).$type<EventTypesType>(),
    mode: varchar({ length: 50 }),
    rich_text_name: text(),
    name: varchar(),
    abbr: varchar({ length: 64 }),
    summary: varchar({ length: 64 }),
    status: varchar({ length: 64 }).default("future").$type<"future" | "live" | "overdue" | "completed">(),

    start: timestamp({ withTimezone: true }), // Absolute moment in timeline
    start_date_reference: varchar({ length: 128 }), // 
    start_date_reference_type: varchar({ length: 10 }).default('start'), // start, end
    start_date_reference_index: integer(), // Add +/- days to the reference.
    start_time: time(), // null, unless used without start.
    start_on_reference: varchar({ length: 128 }),
    start_on_reference_type: varchar({ length: 10 }).default('start'), // start, end
    start_on_reference_index_in_hours: numeric(),
    start_timezone: varchar({ length: 128 }).notNull(),


    end: timestamp({ withTimezone: true }),
    end_time: time(),
    end_date_reference: varchar({ length: 128 }),
    end_date_reference_type: varchar({ length: 10 }).default('start'), // start, end, at_creation, at_last_updated
    end_date_reference_index: integer(),
    end_on_reference: varchar({ length: 128 }),
    end_on_reference_type: varchar({ length: 10 }).default('start'), // start, end, at_creation, at_last_updated
    end_on_reference_index_in_hours: numeric(),
    end_timezone: varchar({ length: 128 }),


    parent_id: varchar({ length: 255 }),
    location_id: varchar({ length: 255 }),
    end_location_id: varchar({ length: 255 }),

    location_details: jsonb("location").$type<{
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        zip: string;
    }>(),

    description: jsonb(),
    settings: jsonb().$type<{
        color_options?: { name: string, hex: string, text: string }[],
        preferred_views?: string[],
        preferred_timezones?: string[]

    }>(),

    created_at: timestamp({ withTimezone: true }),
    created_by: varchar({ length: 255 }),
    created_with: varchar({ length: 255 }),
    created_with_status: varchar({ length: 64 }).default("retrospect").$type<"retrospect" | "now" | "planned">(),
    last_updated_at: timestamp({ withTimezone: true }),
    last_updated_by: varchar({ length: 255 }),
    last_updated_with: varchar({ length: 255 }),
    version: integer().default(0),
    latest_version: varchar({ length: 255 }),
    checksum: text(),
    cover_img_uri: varchar({ length: 255 }),
    icon_img_uri: varchar({ length: 255 }),
    wordmark_img_uri: varchar({ length: 255 }),
    color: varchar({ length: 16 }).default("#00000000"),
    text_color: varchar({ length: 16 }).default("#ffffff"),
    theme: json().$type<EventTheme>(),
    value: integer().default(1),
    value_units: varchar({ length: 16 }),
    goal: integer().default(1)
})

export const Users = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar(),
    username: varchar().notNull(),
    abbr: varchar({ length: 16 }),
    email: varchar(),
    description: varchar(),
    is_admin: boolean().default(false).notNull(),
    birthday: timestamp({ withTimezone: true }),
    home_timezone: varchar(),
    passkey: varchar().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    status: varchar().default('created_not_activated'),
    is_dark: boolean().default(false).notNull(),
    icon_img_uri: varchar({ length: 255 }),
    preferred_timezones: text("preferred_timezones").array(),
})

export const Sessions = pgTable("session", {
    id: varchar({ length: 255 }).primaryKey(),
    user_id: varchar({ length: 255 }).notNull(),
    status: varchar().default("active"),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    last_accessed_at: timestamp({ withTimezone: true }).defaultNow(),
    expires_at: timestamp({ withTimezone: true }).defaultNow(),
    revoked_at: timestamp({ withTimezone: true }),
    ipAddress: varchar(),
    product_version: varchar(),
    notes: varchar()
})


export const Certificates = pgTable("certificates", {
    id: varchar({ length: 255 }).primaryKey(),
    event_id: varchar({ length: 255 }),
    child_event_id: varchar({ length: 255 }),
    user_id: varchar({ length: 255 }),
    index: integer(),
    type: varchar({ length: 128 }).default('member'),
    role: varchar({ length: 100 }),
    notes: text(),
    metadata: jsonb()
})



export const EventRelations = relations(Events, ({ one }) => ({
    start_location: one(Events, {
        fields: [Events.location_id],
        references: [Events.id]
    }),
    end_location: one(Events, {
        fields: [Events.end_location_id],
        references: [Events.id]
    }),
    last_updated_action_event: one(Events, {
        fields: [Events.last_updated_with],
        references: [Events.id],
    }),
    latest_version_of_event: one(Events, {
        fields: [Events.latest_version],
        references: [Events.id]
    }),
    event_created_by: one(Users, {
        fields: [Events.created_by],
        references: [Users.id]
    })
}));


export const CertificateRelations = relations(Certificates, ({ one }) => ({
    event: one(Events, {
        fields: [Certificates.event_id],
        references: [Events.id]
    }),
    child_event: one(Events, {
        fields: [Certificates.child_event_id],
        references: [Events.id]
    }),
    user: one(Users, {
        fields: [Certificates.user_id],
        references: [Users.id]
    })
}))






export type OverplannerEventViewType =
    | (typeof Events.$inferSelect & {
        type: "single_time";
        start: NonNullable<typeof Events.$inferSelect["start"]>;
        certificate?: OverplannerCertificateType;
    })
    | (typeof Events.$inferSelect & {
        type: Exclude<
            typeof Events.$inferSelect["type"],
            "single_time"
        >;
        certificate?: OverplannerCertificateType;
    });


export type OverplannerEventType = typeof Events.$inferInsert;



export type OverplannerUserType = typeof Users.$inferInsert;
export type OverplannerUserViewType = typeof Users.$inferSelect;
export type OverplannerUserPublicType = Omit<OverplannerUserViewType, "passkey">;


export type OverplannerSessionType = typeof Sessions.$inferInsert;


export type OverplannerCertificateType = typeof Certificates.$inferInsert;