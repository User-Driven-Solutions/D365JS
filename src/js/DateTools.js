const addWorkDays = function (startDate, days) {
    if(isNaN(days)) {
        console.log("Value provided for \"days\" was not a number");
        return
    }
    if(!(startDate instanceof Date)) {
        console.log("Value provided for \"startDate\" was not a Date object");
        return
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    const dow = startDate.getDay();
    let daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0)
        daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        const remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            //Add two days for each working week by calculating how many weeks are included
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
            if (remainingWorkDays % 5 == 0)
                daysToAdd -= 2;
        }
    }
    startDate.setDate(startDate.getDate() + daysToAdd);
    return startDate;
}

const checkDate = (dateValue, checkType='current') => {

    let testDate;
    if (dateValue instanceof Date && !isNaN(dateValue)) {
        testDate = dateValue
    } else if (typeof dateValue === 'string' || typeof dateValue === 'object') {
        const parsedDate = new Date(dateValue);
        if(!isNaN(parsedDate)) {
            testDate = parsedDate;
        };
    }

    if (!testDate)
    {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    testDate.setHours(0, 0, 0, 0);

    switch (checkType) {
        case 'future':
            return testDate > today;
        case 'past':
            return testDate < today;
        default:
            return testDate - today === 0;
    }
}

/***
 * Confirm a provided date or date string is in the future.
 * @method isFutureDate
 * @param {string|date} testDate A date or date-string to be tested
 * @return {boolean}
 */
const isFutureDate = (dateValue) => {
    return checkDate(dateValue, 'future')
}

/***
 * Confirm a provided date or date string is in the past.
 * @method isPastDate
 * @param {string|date} testDate A date or date-string to be tested
 * @return {boolean}
 */
const isPastDate = (dateValue) => {
    return checkDate(dateValue, 'past')
}

/***
 * Confirm a provided date or date string is in the past.
 * @method isPastDate
 * @param {string|date} testDate A date or date-string to be tested
 * @return {boolean}
 */
const isCurrentDate = (dateValue) => {
    return checkDate(dateValue)
}

export { addWorkDays, isFutureDate, isPastDate, isCurrentDate }
