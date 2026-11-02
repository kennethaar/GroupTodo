const trackerProp = (name, k) => trim(String(trackerPageAt(name)?.page.props?.[k] ?? ""));
const trackerArea = name => trackerPageAt(name)?.space || trackerTemplatesWith(name)[0]?.sp ||
  trackerGroup(name)?.entries.at(-1)?.space || V.space;
