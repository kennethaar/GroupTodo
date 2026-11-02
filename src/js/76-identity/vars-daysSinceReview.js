const daysSinceReview = () => dateDiffDays(reviewBaseline(), todayISO()) ?? 0;
const reviewDue = () => daysSinceReview() >= CFG.reviewEveryDays;
