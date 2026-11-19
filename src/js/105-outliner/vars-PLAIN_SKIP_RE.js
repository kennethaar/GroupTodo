/* What on a line is not plain words: a link, code, an address or a quoted
   Windows path ("C:\...\Nordic Lights\..." is a folder, #333). Split by it,
   the plain words sit at the even places (linkKnownNames, unlinkedNames). */
const PLAIN_SKIP_RE = /(\[\[[^\]]*(?:\]\[[^\]]*)?\]\]|`[^`]*`|["\u201C](?:[A-Za-z]:|\\\\[^\\\s"\u201D]+)\\[^"\u201D\n]*["\u201D]|https?:\/\/\S+|file:\S+|(?:tel|telto|sms):(?:\/\/)?\+?\d[\d\s\-.()]*\d|mapto:[^|;\[\]#\n]+|(?:mailto|tel|telto|sms|geo|msteams|teams):\S+|\]\])/i;
