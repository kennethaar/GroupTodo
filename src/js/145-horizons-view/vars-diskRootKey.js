/* Where an area's folder sits on this computer. A folder you picked is handed
   to the page by name only -- the browser never says where it is on disk -- so
   it is asked once, per area and per device, and kept here. serve.py says
   where its vault is, so that one is only asked when the server will not. */
const diskRootKey = space => "diskroot:" + (space || "");
