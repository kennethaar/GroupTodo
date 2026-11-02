const askingAbout = name => name ? mentionRows().filter(a => samePerson(a.mention, name)) : [];
