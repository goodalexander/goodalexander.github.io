"""Local-only browser checks. Requires Python Playwright and installed Chromium.

Usage: python3 tests/check_trade_idea_browser.py /absolute/evidence/directory
No request reaches a wallet, newsletter service, or external website.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import sys

from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
evidence = Path(sys.argv[1])
evidence.mkdir(parents=True, exist_ok=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=root / '_site/draft-preview'))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
origin = f'http://127.0.0.1:{server.server_port}'
url = origin + '/trade-ideas/tsla-short-example/'
try:
    with sync_playwright() as p:
        browsers = sorted((Path.home() / '.cache/ms-playwright').glob('chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell'))
        browser = p.chromium.launch(executable_path=str(browsers[-1]), headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})
        context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(origin + '/') else route.abort())
        context.add_init_script("""
            window.walletCalls = [];
            window.walletListeners = {};
            window.ethereum = {
                request: async args => {
                    window.walletCalls.push(args);
                    if (args.method !== 'eth_requestAccounts') throw new Error('Forbidden request');
                    return ['0x1111111111111111111111111111111111111111'];
                },
                on: (event, callback) => { window.walletListeners[event] = callback; },
                removeListener: event => { delete window.walletListeners[event]; }
            };
        """)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        page.wait_for_function("document.querySelector('[data-nav]').textContent.includes('no valid NAV')")
        assert page.locator('[data-proof-status]').inner_text() == 'proof age limit not set'
        assert page.locator('[data-fee]').inner_text() == 'Fee not set'
        buy = page.get_by_role('button', name='Buy — closed')
        assert buy.is_disabled()
        assert page.evaluate('window.walletCalls') == []
        page.screenshot(path=str(evidence / 'desktop.png'), full_page=True)
        page.set_viewport_size({'width': 390, 'height': 844})
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        page.screenshot(path=str(evidence / 'mobile.png'), full_page=True)
        page.get_by_role('button', name='Connect wallet (address only)').click()
        page.wait_for_function("document.querySelector('[data-wallet-status]').textContent.includes('0x1111')")
        assert page.evaluate('window.walletCalls') == [{'method': 'eth_requestAccounts'}]
        assert buy.is_disabled()
        page.evaluate("window.walletListeners.accountsChanged([])")
        assert 'Connect again' in page.locator('[data-wallet-status]').inner_text()
        assert '0x1111' not in page.locator('[data-wallet-status]').inner_text()
        # Replace the section with a fresh copy and mount with explicitly synthetic
        # data. The shipped file remains entirely unset.
        page.evaluate("""async () => {
            const old = document.querySelector('[data-navcoin-checkout]');
            const root = old.cloneNode(true);
            old.replaceWith(root);
            root.querySelector('[data-navcoin-config]').textContent = JSON.stringify({
                coin: 'SYNTHETIC TEST COIN', navUsd: 1.2345,
                lastProofAt: '2026-01-01T00:00:00Z', proofAgeLimitSeconds: 3600, feeBps: 17
            });
            const module = await import('/trade-idea-checkout.mjs');
            window.checkoutCleanup = module.mountCheckout(root, window.ethereum);
        }""")
        assert page.locator('[data-coin]').inner_text() == 'SYNTHETIC TEST COIN'
        assert page.locator('[data-nav]').inner_text() == '$1.2345 USD'
        assert page.locator('[data-proof-time]').inner_text() == '2026-01-01T00:00:00Z'
        assert page.locator('[data-fee]').inner_text() == '17 bps (0.17%)'
        assert 'Warning: last proof is older' in page.locator('[data-proof-status]').inner_text()
        assert buy.is_disabled()
        # Exercise a fresh proof crossing its limit without reloading the page.
        page.evaluate("""async () => {
            window.checkoutCleanup();
            const root = document.querySelector('[data-navcoin-checkout]');
            root.querySelector('[data-navcoin-config]').textContent = JSON.stringify({
                lastProofAt: new Date().toISOString(), proofAgeLimitSeconds: 0.2
            });
            const module = await import('/trade-idea-checkout.mjs');
            window.checkoutCleanup = module.mountCheckout(root, null);
        }""")
        assert 'within' in page.locator('[data-proof-status]').inner_text()
        page.wait_for_function("document.querySelector('[data-proof-status]').textContent.includes('older')")
        assert buy.is_disabled()
        page.get_by_role('button', name='Connect wallet (address only)').click()
        page.wait_for_function("document.querySelector('[data-wallet-status]').textContent.includes('No wallet address')")
        # The API form is exercised against a mock, with the original payload.
        posted = []
        def newsletter(route):
            posted.append(json.loads(route.request.post_data))
            route.fulfill(status=200, content_type='application/json', body='{}')
        page.route('https://goodalexander-subscribe.fly.dev/subscribe', newsletter)
        page.goto(origin + '/api/')
        page.get_by_label('Work email').fill('example@example.invalid')
        page.get_by_role('button', name='Join the list').click()
        page.wait_for_function("document.querySelector('.signup__status').textContent.includes('address has joined')")
        assert posted == [{'email': 'example@example.invalid', 'label': 'api-key', 'website': ''}]
        assert 'API access is separate' in page.locator('.signup__status').inner_text()
        assert not errors, errors
        nojs = browser.new_context(java_script_enabled=False)
        nojs.route('**/*', lambda route: route.continue_() if route.request.url.startswith(origin + '/') else route.abort())
        page_nojs = nojs.new_page()
        page_nojs.goto(url)
        assert page_nojs.get_by_role('button', name='Buy — closed').is_disabled()
        assert page_nojs.locator('[data-proof-status]').inner_text() == 'proof age limit not set'
        assert 'require JavaScript' in page_nojs.locator('noscript').inner_text()
        page.goto(origin + '/trade-ideas/tsla-short-2026-11-10/')
        assert '12.5%' in page.locator('main').inner_text()
        # The page is an unpublished draft pending founder review, so the video
        # section legitimately shows its placeholder; what must never appear is
        # a purchase path. The checkout gate renders the eligibility verdict.
        assert page.get_by_role('button', name='Buy — closed').is_disabled()
        assert 'approves this idea until 2026-11-14T00:00:00Z' in page.locator('[data-eligibility-status]').inner_text()
        page.goto(url)
        assert 'refused for checkout' in page.locator('[data-eligibility-status]').inner_text()
        for width,label in [(1440,'published-desktop'),(390,'published-mobile')]:
            page.set_viewport_size({'width':width,'height':1000})
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
            page.screenshot(path=str(evidence / (label+'.png')), full_page=True)
        browser.close()
    print('PASS: desktop/mobile layout, no overflow, disabled buying, no automatic wallet requests, address-only connection, account reset, missing wallet, configured NAV/fee/time display, stale warning, elapsed-time expiry, mocked newsletter payload/success, no-JS closure; eligibility status line rendered by the checkout gate (draft shows "approves this idea until 2026-11-14T00:00:00Z", unbacked page shows "refused for checkout"); no browser script errors. External requests blocked.')
finally:
    server.shutdown()
    server.server_close()
    thread.join()
