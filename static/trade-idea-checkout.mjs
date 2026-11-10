// This module has no settlement path. Its only wallet request reads addresses.
export function proofStatus(data, now = Date.now()) {
  const limit = data.proofAgeLimitSeconds;
  if (limit === null || limit === undefined) return 'proof age limit not set';
  if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 0) {
    return 'Proof age limit is invalid. Buying is closed.';
  }
  const value = data.lastProofAt;
  const timestamp = typeof value === 'string' ? Date.parse(value) : NaN;
  // Accept UTC ISO timestamps with seconds and optional milliseconds; reject
  // local times and dates silently normalized by Date.parse (e.g. 30 February).
  if (!Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().replace('.000Z', 'Z') !== value.replace('.000Z', 'Z')) {
    return 'Last proof time is missing or invalid. Buying is closed.';
  }
  if (!Number.isFinite(now) || timestamp > now) return 'Last proof time is in the future or the clock is invalid. Buying is closed.';
  if ((now - timestamp) / 1000 > limit) return 'Warning: last proof is older than the configured age limit. Buying is closed.';
  return 'Last proof is within the configured age limit. Buying remains closed.';
}

export function feeText(value) {
  if (value === null || value === undefined) return 'Fee not set';
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 'Fee is invalid. Buying is closed.';
  return `${value} bps (${value / 100}%)`;
}

export async function readWalletAddress(provider) {
  if (!provider || typeof provider.request !== 'function') throw new Error('Wallet unavailable');
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const address = Array.isArray(accounts) ? accounts[0] : null;
  if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address)) throw new Error('No address');
  return address;
}

export function mountCheckout(root, provider) {
  const find = selector => root.querySelector(selector);
  let data;
  try {
    data = JSON.parse(find('[data-navcoin-config]').textContent);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid data');
  } catch {
    find('[data-proof-status]').textContent = 'Checkout data is unavailable. Buying is closed.';
    find('[data-connect-wallet]').disabled = true;
    return;
  }
  find('[data-coin]').textContent = typeof data.coin === 'string' && data.coin.trim() ? data.coin : 'Not attached — placeholder';
  find('[data-nav]').textContent = typeof data.navUsd === 'number' && Number.isFinite(data.navUsd) && data.navUsd > 0
    ? `$${data.navUsd} USD` : 'Unavailable — no valid NAV supplied';
  find('[data-proof-time]').textContent = typeof data.lastProofAt === 'string' && data.lastProofAt
    ? data.lastProofAt : 'Unavailable — no proof supplied';
  find('[data-fee]').textContent = feeText(data.feeBps);
  const refresh = () => { find('[data-proof-status]').textContent = proofStatus(data); };
  refresh();
  // Recheck elapsed wall time while the page stays open. This is a display
  // refresh interval, not a default proof-age limit.
  const timer = setInterval(refresh, 1000);
  const button = find('[data-connect-wallet]');
  const status = find('[data-wallet-status]');
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const address = await readWalletAddress(provider);
      status.textContent = `Wallet address: ${address}. Buying remains closed.`;
    } catch {
      status.textContent = 'No wallet address connected. Open or install a wallet, or try again. Buying remains closed.';
    } finally {
      button.disabled = false;
    }
  });
  // Clear an earlier address if the wallet changes or disconnects; do not
  // automatically request new permissions or persist the address.
  const clearAddress = () => { status.textContent = 'Wallet changed or disconnected. Connect again to read its address.'; };
  if (typeof provider?.on === 'function') {
    provider.on('accountsChanged', clearAddress);
    provider.on('disconnect', clearAddress);
  }
  return () => {
    clearInterval(timer);
    if (typeof provider?.removeListener === 'function') {
      provider.removeListener('accountsChanged', clearAddress);
      provider.removeListener('disconnect', clearAddress);
    }
  };
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-navcoin-checkout]').forEach(root => {
    const cleanup = mountCheckout(root, window.ethereum);
    if (cleanup) window.addEventListener('pagehide', event => {
      // A page restored from the browser's back/forward cache must keep
      // checking proof age when its timers resume.
      if (!event.persisted) cleanup();
    });
  });
}
