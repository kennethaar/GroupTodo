/* Worked out once per draw, like QUIET_CACHE: this is asked by the coach, the
   suggestions and every project row, and scanning the vault for each of them
   is a lot of walking for one answer. */
let TOUR_PATH_CACHE;                                    // undefined = not yet this draw
