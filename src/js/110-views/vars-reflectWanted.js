const reflectWanted = () => intentions().length > 0 || reflectLog().length > 0;
const reflectWeek = () => isoWeek(todayISO())[0];
