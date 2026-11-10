"""Check production exclusion, review HTML, and the unchanged signup contract.

Run after building _site/production and _site/draft-preview.
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess


class Elements(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


root = Path(__file__).resolve().parents[1]
path = Path('trade-ideas/tsla-short-example/index.html')
production = root / '_site/production'
draft = root / '_site/draft-preview' / path
assert not (production / path).exists(), 'Draft must not have a production URL'
for file in production.rglob('*'):
    if file.suffix in {'.html', '.json', '.xml'}:
        text = file.read_text()
        assert 'tsla-short-example' not in text, f'Draft leaked into {file}'
        assert 'TSLA short — draft / example' not in text, f'Draft title leaked into {file}'
text = draft.read_text()
for expected in ['Draft / example', 'SHORT', 'Equity long/short', 'Placeholder', 'financial model', 'Trade-idea video', 'Attached NAVCoin', 'proof age limit not set', 'Fee not set', 'Buy — closed']:
    assert expected in text, expected
assert not re.search(r'\b(pnl|sharpe|drawdown)\b|trading\s+p(?:&amp;|&)l', text, re.I)
elements = Elements(text).elements
assert any(tag == 'meta' and a.get('name') == 'robots' and a.get('content') == 'noindex, nofollow' for tag, a in elements)
assert any(tag == 'button' and 'disabled' in a and a.get('type') == 'button' for tag, a in elements)
assert any(tag == 'link' and a.get('href') == '/styles.css' for tag, a in elements)
api = (production / 'api/index.html').read_text()
assert 'Join the list' in api and 'API is being prepared' in api
assert 'Get an API key' not in api and 'Get my API key' not in api
app = (production / 'app.js').read_text()
assert 'Your API key follows' not in app
# This task changes only the success message in the existing handler.
original = subprocess.check_output(['git', 'show', '2ef270a4d111c64799e8766171b0259d3cb1b446:static/app.js'], cwd=root, text=True)
assert app == original.replace('Check your inbox. Your API key follows.', 'Your address has joined the newsletter list. The API is being prepared.')
original_api = subprocess.check_output(['git', 'show', '2ef270a4d111c64799e8766171b0259d3cb1b446:static/api/index.html'], cwd=root, text=True)
fields = lambda html: [(tag, attrs) for tag, attrs in Elements(html).elements if tag in {'form', 'input', 'button'}]
assert fields(api) == fields(original_api), 'Form fields, attributes and labels must remain unchanged'
print('PASS: draft excluded from production pages, sitemap and indexes; review HTML is marked, closed and contains no forbidden metrics; signup behavior unchanged.')
