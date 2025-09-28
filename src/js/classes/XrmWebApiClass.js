export default class XrmWebApiClass {
  async GetEnvironmentVariableValue(name) {
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
}
