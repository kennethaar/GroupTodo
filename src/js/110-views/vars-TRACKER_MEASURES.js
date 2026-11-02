const TRACKER_MEASURES = {
  max:     {label: "Estimated max", unit: "kg", agg: "max", why: "weight × (1 + best set's reps / 30)"},
  weight:  {label: "Weight", unit: "kg", agg: "max"},
  volume:  {label: "Volume", unit: "kg", agg: "sum", why: "weight × all the reps"},
  reps:    {label: "Total reps", agg: "sum"},
  best:    {label: "Best set", unit: "reps", agg: "max"},
  number:  {label: "Number", agg: "sum"},
  minutes: {label: "Minutes", unit: "min", agg: "sum"},
  rating:  {label: "Rating", agg: "avg"},
  done:    {label: "Done", agg: "max"},
  hours:   {label: "Hours", unit: "h", agg: "sum"},
  amount:  {label: "Amount", agg: "sum"},
  stock:   {label: "In and out", agg: "sum"},
};
