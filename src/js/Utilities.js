// Return the name of the current application
const currentAppName = async () => {
    const globalContext = Xrm.Utility.getGlobalContext();
    const appName = await globalContext.getCurrentAppName();
    return appName;  
}

/**
 * Determines whether the current user is a member of a specified team.
 * 
 * @param {string} teamKey - The value of the team identifier (team name or team GUID).
 * @returns {Promise<boolean>} A promise that resolves to `true` if the user is a member of the specified team, 
 *                             or `false` otherwise.
 * @throws {Error} Throws an error if there is an issue retrieving team or membership information.
 * 
 * @example
 * // Check if the user is part of a team by name
 * isUserInTeam("Marketing Team").then(isMember => {
 *     console.log(isMember); // true or false
 * });
 * 
 * @example
 * // Check if the user is part of a team by GUID
 * isUserInTeam("123e4567-e89b-12d3-a456-426614174000").then(isMember => {
 *     console.log(isMember); // true or false
 * });
 */
const isUserInTeam = async function (teamKey) {
    // Get the current user's ID
    const currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");

    // Single query to retrieve team and memberships using $expand
    const filterColumn = teamKey.isGuid ? 'teamid' : 'name';
    const query = `?$filter=${filterColumn} eq '${teamKey}'&$select=teamid&$expand=teammembership_association($filter=systemuserid eq ${currentUserId};$select=systemuserid)`;
    return Xrm.WebApi.retrieveMultipleRecords("team", query).then(
        function success(result) {
            if (!result.entities.length) {
                console.log(`No team found with the ${filterColumn} '${teamKey}'.`);
                return false;
            }

            const userFoundInTeam = result.entities[0].teammembership_association.length > 0;
            return userFoundInTeam;
        },
        function error(e) {
            throw new Error(`Error retrieving team and membership information: ${e}`);
        }
        );    
}

export {currentAppName, isUserInTeam}
