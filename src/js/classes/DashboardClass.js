export default class DashboardClass
{
    context;

    constructor(context)
    {
        this.context = context;
    }

    get name()
    {
        return this.context.name;
    }
}
