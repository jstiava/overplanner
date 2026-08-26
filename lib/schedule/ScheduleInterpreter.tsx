import { se } from "date-fns/locale";



export class ScheduleInterpreter {


    static isOpenDaily = () => {
        return false;
    }

    static getActiveDaysPerWeek = () => {
        return 1;
    }

    static getNumberOfHoursPerWeek = () => {
        return 1;
    }

    static isOpen = () => {
        return false;
    }

    static isOpenWithContext = () => {
        return {
            isOpen: false,
            context: "Mon-Fri: 8am-5pm"
        };
    }

    
    
}