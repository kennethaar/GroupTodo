/* A space's profile is vault content, written to its own GTD.md, and a brand new
   space has no vault yet -- it is created here but not loaded until openSpace.
   So the answer waits here by name and openSpace writes it once the pages are
   in hand. */
const PENDING_PROFILE = new Map();
