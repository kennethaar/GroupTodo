const choreSizePick = () => fselect("How long", "0", [["0", "Not sized"], ["1", "15 minutes"], ["2", "30 minutes"],
  ["3", "45 minutes"], ["4", "An hour or more"]], () => {});
