import { DateTime } from "luxon"

export const returnReadableTimeShort = (time) => {
    return DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT)
}
