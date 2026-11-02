/* ---------- your areas, as one ladder ----------
   An area is a folder of its own -- Work, Home, the choir -- and in GTD terms
   it is Horizon 2: a part of your life you keep in good shape and never finish.
   So Horizons is read top-down as one ladder. Purpose and vision are yours and
   come from your home area, the first one you made. Goals are gathered from
   every area. Horizon 2 is the areas themselves, each with the responsibilities
   it holds. Opening an area shows its own ladder, and makes it the area new
   things land in, so whatever you write there is written into that folder. */
const homeArea = () => (Spaces.list[0] && Spaces.list[0].name) || Spaces.active;
const HZ_LOADING = new Set();
