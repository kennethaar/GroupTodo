const icsStamp = (day, time) => icsDate(day) + "T" + time.replace(":", "") + "00";
