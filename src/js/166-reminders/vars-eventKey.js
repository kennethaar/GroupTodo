const eventKey = e => e.kind === "birthday" ? "bday|" + e.b.name + "|" + e.day
                                            : e.day + "T" + e.time + "|" + e.title;
