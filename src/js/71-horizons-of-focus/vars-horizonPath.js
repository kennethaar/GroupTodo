const horizonPath = key => join(DIR_HORIZONS, (HORIZON_BY_KEY[key]?.page || key) + ".md");
const isHorizonPage = path =>
  path.startsWith(DIR_HORIZONS + "/") && trim(getPage(path)?.props?.type || "") === "horizon";
