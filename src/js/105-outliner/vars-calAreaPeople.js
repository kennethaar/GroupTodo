// You, under whatever name, plus everybody else there.
const calAreaPeople = space => LOADED.has(space) ? 1 + areaOthers(space).length : 0;
/* A folder you joined is somebody else's as well, whether or not anybody in
   it has written their name down yet. */
const calAreaShared = space => !!Spaces.get(space)?.joined || calAreaPeople(space) > 1;
const calSharedNote = space => calAreaPeople(space) > 1
  ? "shared with " + calAreaPeople(space) + " people" : "a folder you joined";
const calSharedWhy = space => space + " is " + calSharedNote(space) + ", so calendars do not come into it: " +
  "everyone in it could read your whole calendar, private appointments included. Choose an area that is yours alone " +
  "as your own area in Calendars, and show the meetings that concern " + space + " there with “Also show in”";
