/* ---------- QR codes ----------
   Drawn here, with nothing sent anywhere: a port of Project Nayuki's QR Code
   generator (MIT, nayuki.io/page/qr-code-generator-library), cut down to what
   a link needs. Byte mode, which takes any text, and error correction LOW,
   which keeps the code small enough to scan off a screen. The version grows
   with the text; the mask is the one with the lowest penalty, as the
   standard asks. Returns rows of dark (true) and light modules, or null when
   the text is too long for even the largest code. */
const QR_ECC = [7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30];
const QR_BLOCKS = [1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25];
