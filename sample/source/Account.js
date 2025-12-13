import { FormClass } from "d365js";
import { createBoundInvoker } from "d365js"

export default class Account extends FormClass
{
  constructor(context) {
    super(context);
  }

  /**
   * 
   */
  invokeGetAccountLinks = createBoundInvoker({
    operationName: "uds_GetAccountLinks",
    entityLogicalName: "account",
    boundParameter: "entity",
    parameterTypes: {
        entity: {
            typeName: "mscrm.account",
            structuralProperty: 5
        },
        account: {
            typeName: "mscrm.account",
            structuralProperty: 5
        }
    }
  });  
}