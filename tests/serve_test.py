"""serve.py's own tests. Run: python -m unittest tests/serve_test.py"""
import os
import sys
import tempfile
import time
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import serve  # noqa: E402


class History(unittest.TestCase):
    """#407 serve.py keeps earlier versions of each page."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.vault = serve.Vault(self.tmp.name)
        self.hist = os.path.join(self.vault.root, ".history", "pages", "Kitchen.md")

    def tearDown(self):
        self.tmp.cleanup()

    def kept(self):
        if not os.path.isdir(self.hist):
            return []
        out = []
        for n in sorted(os.listdir(self.hist), key=lambda n: os.path.getmtime(os.path.join(self.hist, n))):
            with open(os.path.join(self.hist, n), encoding="utf-8") as fh:
                out.append(fh.read())
        return out

    def test_407_an_overwrite_keeps_the_old_page(self):
        self.vault.write("pages/Kitchen.md", "first")
        self.assertEqual(self.kept(), [], "a new page has nothing earlier to keep")
        self.vault.write("pages/Kitchen.md", "second")
        self.assertEqual(self.kept(), ["first"])
        self.assertNotIn(".history/pages/Kitchen.md", " ".join(self.vault.list()), "history is not a page")

    def age_versions(self, minutes):
        for n in os.listdir(self.hist):
            p = os.path.join(self.hist, n)
            t = os.path.getmtime(p) - minutes * 60
            os.utime(p, (t, t))

    def test_407_one_version_per_ten_minutes_and_only_for_more_than_spaces_and_capitals(self):
        self.vault.write("pages/Kitchen.md", "- Call Anna")
        self.vault.write("pages/Kitchen.md", "- call  anna ")
        self.assertEqual(self.kept(), [], "spaces and capitals only: nothing kept")
        self.vault.write("pages/Kitchen.md", "- Call Anna today")
        self.vault.write("pages/Kitchen.md", "- Call Anna today\n- Buy tiles")
        self.assertEqual(self.kept(), ["- call  anna "], "within ten minutes of a version: nothing more")
        self.age_versions(11)
        self.vault.write("pages/Kitchen.md", "- CALL ANNA TODAY\n- buy  tiles")
        self.assertEqual(len(self.kept()), 1, "ten minutes on, but spaces and capitals only")
        self.vault.write("pages/Kitchen.md", "- Call Anna today\n- Buy tiles\n- Paint")
        self.assertEqual(self.kept()[-1], "- CALL ANNA TODAY\n- buy  tiles", "ten minutes on and a real change")

    def test_407_a_delete_always_keeps_the_page(self):
        self.vault.write("pages/Kitchen.md", "a")
        self.vault.write("pages/Kitchen.md", "ab")
        self.vault.delete("pages/Kitchen.md")
        self.assertEqual(self.kept(), ["a", "ab"])

    def test_407_at_most_20_versions_and_none_older_than_30_days(self):
        os.makedirs(self.hist)
        now = time.time()
        for i in range(25):
            p = os.path.join(self.hist, "v%02d.md" % i)
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(str(i))
            age = (40 * 86400) if i == 10 else (25 - i) * 3600
            os.utime(p, (now - age, now - age))
        self.vault.write("pages/Kitchen.md", "x")
        self.vault.delete("pages/Kitchen.md")
        left = self.kept()
        self.assertEqual(len(left), 20, left)
        self.assertNotIn("10", left, "older than 30 days")
        self.assertEqual(left[-1], "x", "the newest stays")


class ClientGone(unittest.TestCase):
    """#451 a browser that hangs up before the answer leaves no traceback,
    and is not logged as a calendar that failed."""

    def test_451_a_calendar_asked_for_and_left_is_quiet(self):
        import contextlib
        import io
        import socket
        import struct
        import threading
        lines = []

        class Log:
            path = None
            def write(self, text, show=False):
                lines.append(text)

        fetch, log = serve.fetch_calendar, serve.Handler.log
        fetching, gone, answered = threading.Event(), threading.Event(), threading.Event()

        def slow(url):
            fetching.set()
            gone.wait(5)
            time.sleep(0.2)
            return "BEGIN:VCALENDAR\n" + "X" * 200000

        class Done(serve.Server):
            def process_request_thread(self, request, address):
                super().process_request_thread(request, address)
                answered.set()

        serve.fetch_calendar, serve.Handler.log = slow, Log()
        err = io.StringIO()
        try:
            with contextlib.redirect_stderr(err):
                server = Done(("127.0.0.1", 0), serve.Handler)
                threading.Thread(target=server.handle_request).start()
                s = socket.create_connection(server.server_address)
                s.sendall(b"GET /api/calendar?url=https://example.com/a.ics HTTP/1.1\r\nHost: localhost\r\n\r\n")
                self.assertTrue(fetching.wait(5), "the calendar is being fetched")
                # Hang up hard, the way a closed tab does (WinError 10053 / reset).
                s.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack("ii", 1, 0))
                s.close()
                gone.set()
                self.assertTrue(answered.wait(5), "the server is done with it")
                server.server_close()
        finally:
            serve.fetch_calendar, serve.Handler.log = fetch, log
        self.assertNotIn("Traceback", err.getvalue())
        self.assertEqual([x for x in lines if "failed" in x], [], "not a calendar that failed")


if __name__ == "__main__":
    unittest.main()
