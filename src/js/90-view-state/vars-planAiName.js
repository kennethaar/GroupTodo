const planAiName = url => (PLAN_AIS.find(([u]) => u === url) || [url, url.replace(/^https?:\/\//, "").split("/")[0]])[1];
