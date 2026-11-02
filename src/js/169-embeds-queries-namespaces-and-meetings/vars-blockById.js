const blockById = id => blockIdIndex().get(trim(String(id || "")).toLowerCase()) || null;
