/* A task of yours that names somebody, "ask [[p/Alexander Bee]] about
   [[Pollen]]", is still yours to do, but it is something to raise with them. So
   it stands beside what they owe you, one copy per person named, marked with
   who it is for, and it can go in the same check-in. */
const peopleNamedIn = title => linksIn(title).filter(t => /^p\//i.test(t)).map(t => trim(t.slice(2)));
