const isHousehold = name => !!trim(name || "") && household().some(h => samePerson(h.name, name));
/* Everybody who takes turns at the chores: the members, then the household. */
const choreCrew = () => [...members(), ...household().filter(h => !isMember(h.name))];
