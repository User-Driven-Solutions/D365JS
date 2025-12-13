import DashboardClass from  './src/js/classes/DashboardClass.js';
import FormClass from  './src/js/classes/FormClass.js';
import RibbonClass from  './src/js/classes/RibbonClass.js';
import XrmUtilityClass from  './src/js/classes/XrmUtilityClass.js';
import XrmWebApi, {createBoundInvoker, getEnvironmentVariableValue} from  './src/js/XrmWebApi.js';
import { addWorkDays, isFutureDate, isPastDate, isCurrentDate } from  './src/js/DateTools.js';
import { isValidNZBankAccountNumber, isValidCreditCardNumber, isValidCardAccountNumber, maskCreditCardNumber, formatAccountNumber } from  './src/js/TextTools.js';
import { currentAppName, isUserInTeam } from './src/js/Utilities.js';

/**
 * Remove curly braces at either end of a string, and convert to lowercase
 * @returns {string}
 */
String.prototype.StripBraces = function ()
{
    return this.replace(/[{}]/g, "").toLowerCase();
}

export { DashboardClass, FormClass, RibbonClass, XrmUtilityClass, XrmWebApi, createBoundInvoker, getEnvironmentVariableValue, addWorkDays, isFutureDate, isPastDate, isCurrentDate, isValidNZBankAccountNumber, isValidCreditCardNumber, isValidCardAccountNumber, maskCreditCardNumber, formatAccountNumber, currentAppName, isUserInTeam };
