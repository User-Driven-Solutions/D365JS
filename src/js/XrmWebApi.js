
  export async function getEnvironmentVariableValue(name) {
    const fetchXml = `<fetch>
                          <entity name='environmentvariabledefinition' >
                            <attribute name='defaultvalue' />
                              <filter>
                                <condition attribute='schemaname' operator='eq' value='${name}' />
                              </filter>
                              <link-entity name='environmentvariablevalue' from='environmentvariabledefinitionid' to='environmentvariabledefinitionid' link-type='outer' alias='evd' >
                                <attribute name='value' />
                              </link-entity>
                          </entity>
                        </fetch>`;

    const results = await Xrm.WebApi.retrieveMultipleRecords(
      'environmentvariabledefinition',
      '?fetchXml=' + fetchXml,
    );

    if (!results || !results.entities || results.entities.length < 1) {
      return null;
    }

    const variable = results.entities[0];
    if (variable['evd.value']) {
      return variable['evd.value'];
    }

    return variable.defaultvalue;
  }

  /**
  * Creates an invoker for a specific bound action/custom API.
  *
  * @param {Object} spec
  * @param {string} spec.operationName
  * @param {string} spec.entityLogicalName
  * @param {string} spec.boundParameter
  * @param {Object} spec.parameterTypes - all parameters including the bound one
  *
  * @returns {(entityId: string, params?: Object) => Promise<any>}
  */
  export function createBoundInvoker(spec) {
    const {
        operationName,
        entityLogicalName,
        boundParameter,
        parameterTypes
    } = spec;

    // This function does the actual call
    async function invoke(entityId, params = {}) {
        const cleanId = entityId.replace(/[{}]/g, "");

        // Build request "class"
        function Request() {
            // bound parameter (e.g. "entity")
            this[boundParameter] = {
                entityType: entityLogicalName,
                id: cleanId
            };

            // extra parameters
            Object.keys(params).forEach(name => {
                this[name] = params[name];
            });
        }

        Request.prototype.getMetadata = function () {
            return {
                boundParameter,
                operationName,
                operationType: 0,
                parameterTypes
            };
        };

        const req = new Request();
        const response = await Xrm.WebApi.online.execute(req);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Execute failed for ${operationName}`);
        }

        return response.json().catch(() => ({}));
    }

    return invoke;
  }

export default {
  getEnvironmentVariableValue,
  createBoundInvoker
}
