/* The birthdays lean-ui already reads from birthday:: on person pages, as the
   next day each comes round. */
function birthdays() {
  return memo("birthdays", () => upcomingBirthdays(366).map(x =>
    ({path: x.path, space: x.space, name: x.name, day: x.iso, age: x.age})));
}
