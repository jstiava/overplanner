

import { OverplannerEventType } from "@/schema";
import { time } from "console";
import { format, formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { differenceInCalendarDays, differenceInMinutes, getDay, isSameDay, parse, addDays, isAfter, startOfWeek, endOfWeek, startOfMonth, endOfMonth, endOfDay, endOfYear, startOfDay, startOfYear, isBefore, eachDayOfInterval, isSameMonth, addMonths, addWeeks, addMinutes } from "date-fns";
import { TheaterIcon } from "lucide-react";




// Minute-to-minute granularity
export default class OverplannerDate {

    static CONSTANTS = {
        'example': 60
    }

    utc!: Date;
    zoned_time!: Date;
    timezone!: string;

    writeAndConvertUtcToTimedZone() {
        this.zoned_time = toZonedTime(this.utc, this.timezone);
    }

    constructor();
    constructor(target: OverplannerDate);
    constructor(target: Date, timezone: string);
    constructor(target: string, timezone: string);
    constructor(target: string, timezone: string, format: string);

    constructor(
        target?: OverplannerDate | Date | string,
        timezone?: string,
        format?: string
    ) {

        try {
            this.timezone = timezone ?? "UTC"

            if (!target) {
                this.utc = new Date();
                this.zoned_time = this.utc;
                return;
            }

            if (target instanceof OverplannerDate) {
                this.utc = target.utc;
                this.zoned_time = this.utc;
                return;
            }

            if (target instanceof Date) {
                this.utc = target;
                this.zoned_time = timezone == 'UTC' ? new Date(this.utc) : toZonedTime(new Date(this.utc), this.timezone);
                return;
            }

            if (target === 'now') {
                const now = new Date();

                this.utc = now;
                this.zoned_time = toZonedTime(now, this.timezone);

                return;
            }
            // target is string
            if (format && timezone) {
                const parsed = parse(
                    target,
                    format ? format : "EEEE MMM d h:mm a yyyy",
                    new Date()
                );

                if (!parsed) {
                    throw new Error("Parsing issue.")
                }

                if (timezone != 'UTC') {
                    this.utc = fromZonedTime(parsed, this.timezone);
                    this.writeAndConvertUtcToTimedZone()
                    return;
                }

                this.utc = parsed;
                this.writeAndConvertUtcToTimedZone()

                return;

            }
        }
        catch (err) {
            console.log(err)
            throw new Error("Error while creating Overplanner object.")
        }

        throw new Error("Could not build OverplannerDate object.")
    }

    _isSameTimezone(target: OverplannerDate) {
        return target.timezone != this.timezone
    }

    valueOf() {
        return this.utc.toISOString();
    }

    /**
     * "yyyy-MM-dd", "MM/dd/yyyy", "EEE, MMM d", "h:mm a"
     * @param formatStr 
     * @returns 
     */
    print(formatStr: string) {
        return format(this.zoned_time, formatStr)
    }

    getIsLocalToday(timezone?: string) {
        return isSameDay(
            toZonedTime(this.utc, this.timezone),
            toZonedTime(new Date(), this.timezone)
        );
    }

    isSameLocalDate(target: OverplannerDate) {
        return isSameDay(
            toZonedTime(this.utc, this.timezone),
            toZonedTime(target.utc, this.timezone)
        )
    }

    isSameLocalMonth(target: OverplannerDate) {
        return isSameMonth(
            toZonedTime(this.utc, this.timezone),
            toZonedTime(target.utc, this.timezone)
        )
    }

    // 0-6
    getLocalDayOfTheWeekIndex() {
        return getDay(toZonedTime(this.utc, this.timezone));
    }


    /**
     * e.g. An event occurs today, the target tomorrow, result will always be -1.
     * (Assuming same timezones)
     */
    getLocalDaysDiff(target: OverplannerDate) {
        if (!this._isSameTimezone(target)) {
            throw new Error("Warning: Different time zones.");
        }

        return differenceInCalendarDays(
            toZonedTime(this.utc, this.timezone),
            toZonedTime(target.utc, this.timezone)
        );
    }

    getLocalDurationInMinutes(target: OverplannerDate) {
        if (!this._isSameTimezone(target)) {
            throw new Error("Warning: Different time zones.");
        }

        return differenceInMinutes(
            toZonedTime(this.utc, this.timezone),
            toZonedTime(target.utc, this.timezone)
        );
    }

    minus(target: OverplannerDate) {
        return (this.utc.getTime() - target.utc.getTime());
    }

    clone() {
        return new OverplannerDate(this.utc, this.timezone)
    }

    add(amount: number, unit: 'days' | 'weeks' | 'months' | 'hours' | 'minutes') {
        if (unit == 'days') {
            return this._addDays(amount);
        }
        else if (unit == 'weeks') {
            return this._addWeeks(amount);
        }
        else if (unit == 'months') {
            return this._addMonths(amount);
        }
        else if (unit == 'minutes') {
            return this._addMinutes(amount);
        }

        throw new Error("Unit not allowed.")
    }

    _addMinutes(amount: number) {
        return new OverplannerDate(fromZonedTime(addMinutes(this.zoned_time, amount), this.timezone), this.timezone)
    }

    _addDays(amount: number) {
        return new OverplannerDate(fromZonedTime(addDays(this.zoned_time, amount), this.timezone), this.timezone);
    }

    _addMonths(amount: number) {
        return new OverplannerDate(fromZonedTime(addMonths(this.zoned_time, amount), this.timezone), this.timezone);
    }

    _addWeeks(amount: number) {
        return new OverplannerDate(fromZonedTime(addWeeks(this.zoned_time, amount), this.timezone), this.timezone);
    }

    _zeroOutSeconds() {
        return new OverplannerDate(fromZonedTime(new Date(this.utc.setSeconds(0, 0)), this.timezone), this.timezone);
    }


    getStartOf(unit: 'day' | 'week' | 'month') {
        const unitConversionMethod = OverplannerDate._getStartOfUnitConversionMethod(unit);
        const target = fromZonedTime(unitConversionMethod(this.zoned_time), this.timezone);
        return new OverplannerDate(target, this.timezone)
    }



    getEndOf(unit: 'day' | 'week' | 'month') {
        const unitConversionMethod = OverplannerDate._getEndOfUnitConversionMethod(unit);
        const target = fromZonedTime(unitConversionMethod(this.zoned_time), this.timezone);
        return new OverplannerDate(target, this.timezone)
    }


    isAfter(target: OverplannerDate) {
        return isAfter(this.utc, target.utc);
    }

    isBefore(target: OverplannerDate) {
        return isBefore(this.utc, target.utc);
    }

    getAllDateToTargetAsArray(target: OverplannerDate) {
        return eachDayOfInterval({
            start: this.zoned_time,
            end: target.zoned_time
        })
    }

    static getAllDatesInTheWeekOf(target: OverplannerDate) {
        const x = target.getStartOf('week');
        const y = target.getEndOf('week');
        return eachDayOfInterval({
            start: x.zoned_time,
            end: y.zoned_time
        }).map(z => new OverplannerDate(fromZonedTime(z, target.timezone), target.timezone))
    }

    static getAllDatesInTheMonthOfTargetWithOverflow(target: OverplannerDate) {
        const x = target.getStartOf('month').getStartOf('week');
        const y = target.getEndOf('month').getEndOf('week');
        return eachDayOfInterval({
            start: x.zoned_time,
            end: y.zoned_time
        }).map(z => new OverplannerDate(fromZonedTime(z, target.timezone), target.timezone))
    }

    static _getStartOfUnitConversionMethod(unit: 'day' | 'week' | 'month' | 'year') {

        switch (unit) {
            case 'day':
                return startOfDay;
            case 'week':
                return startOfWeek;
            case 'month':
                return startOfMonth;
            case 'year':
                return startOfYear;
            default:
                throw new Error("Unit not allowed.")
        }
    }

    static _getEndOfUnitConversionMethod(unit: 'day' | 'week' | 'month' | 'year') {

        switch (unit) {
            case 'day':
                return endOfDay;
            case 'week':
                return endOfWeek;
            case 'month':
                return endOfMonth;
            case 'year':
                return endOfYear;
            default:
                throw new Error("Unit not allowed.")
        }
    }


}


export function fetchSupportedTimezones() {
    return Intl.supportedValuesOf("timeZone");
}