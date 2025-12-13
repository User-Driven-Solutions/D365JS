import Account from "./Account.js"

var accountForm;

class AccountForm extends Account {
    constructor(context) {
        super(context);
        this.setValue('name', 'Temporary name set by JS');
        this.addOnChange('websiteurl', ()=>accountForm.setValue('tickersymbol', 'D365'));
        invokeGetAccountClaims(this.guid);
    }

    OnSave()
    {
        console.log("Account Form OnSave method has been triggered");
    }
}

export function OnLoad(context) {
    accountForm = new AccountForm(context);    
}
export function OnSave() {
    accountForm.OnSave();    
}