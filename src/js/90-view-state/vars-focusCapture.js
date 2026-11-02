const focusCapture = () => { tourMarkSeen("capture"); const i = $("#cap"); i.focus(); i.select(); };

/* ============================================================
   113a_EMAIL PASTE
   An email copied out of Gmail or Outlook and pasted into the box at the top
   becomes a page of its own -- who it is from, when, the words -- and a task
   on today that links to it. The page's menu then writes the reply, the
   "any news?" and the forward as an email ready to send, and takes their
   answer back in when it comes.

   A copy carries no headers of its own, so the shape is read off the text:
   either the From:/Sent:/To:/Subject: block Outlook and forwards write, or
   Gmail's subject, sender, "to ..." and "6 days ago" lines. Text that is
   neither is left to be a list, as before.
   ============================================================ */
const MAIL_HEAD = {
  from:    /^(?:from|von|fra|från|de|van)\s*:\s*(.+)$/i,
  sent:    /^(?:sent|date|gesendet|datum|sendt|skickat|dato|envoyé|verzonden)\s*:\s*(.+)$/i,
  to:      /^(?:to|an|til|till|à|aan|para)\s*:\s*(.+)$/i,
  cc:      /^(?:cc|kopi|kopia|kopie)\s*:\s*(.+)$/i,
  subject: /^(?:subject|betreff|emne|ämne|objet|onderwerp|asunto)\s*:\s*(.*)$/i,
};
// Gmail's line under the sender: "to me", "to anna, ben, +8".
const MAIL_TO_LINE = /^(?:to|an|til|till|aan|à)\s+(\S.*)$/i;
const MAIL_ME = /^(?:me|mig|mich|mej|meg|moi|mij)(?:\s*,|\s*$)/i;
const MAIL_LABELS = /^(?:inbox|indbakke|innboks|inkorg|posteingang|external|extern|important|wichtig)$/i;
const MAIL_BUTTONS = /^(?:reply|reply all|forward|antworten|allen antworten|weiterleiten|svar|svar alle|svara|videresend|vidarebefordra|répondre|transférer)$/i;

const mailDateClean = s => trim(String(s || "").replace(/\s*(?:Details|Detaljer|Detalles|Détails)\s*$/i, ""));
const isMailDateLine = s => {
  s = mailDateClean(s);
  return s.length > 0 && s.length < 80 &&
    /ago|yesterday|today|siden|gestern|heute|i går|igår|vor \d|\d{1,2}[:.]\d{2}|\d{4}/i.test(s);
};
