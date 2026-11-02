const timerDialStyle = () => String(getPage(TIMER_PATH)?.props?.style ?? "").trim().toLowerCase() === "dial";
