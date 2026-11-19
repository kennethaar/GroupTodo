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

    def test_407_only_a_change_beyond_spaces_and_capitals_keeps_a_version(self):
        self.vault.write("pages/Kitchen.md", "- Call Anna")
        self.vault.write("pages/Kitchen.md", "- call  anna ")
        self.assertEqual(self.kept(), [], "spaces and capitals only: nothing kept")
        self.vault.write("pages/Kitchen.md", "- Call Anna today")
        self.vault.write("pages/Kitchen.md", "- Call Anna today\n- Buy tiles")
        self.assertEqual(self.kept(), ["- call  anna ", "- Call Anna today"], "every real change keeps the page before it")

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


if __name__ == "__main__":
    unittest.main()
