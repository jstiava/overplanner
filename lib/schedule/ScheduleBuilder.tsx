


class ScheduleBuilder {

    static create = (mask : {
        abbreviations: string[],
        abbr: string,
        name: string
    }[], rawString : string) => {

        



        return {
            days: [],
            hours: [],
            start_date: [],
            end_date: [],
        }
    }
}