import assert from 'node:assert/strict';
import test from 'node:test';
import { feeText, proofStatus, readWalletAddress } from '../static/trade-idea-checkout.mjs';

const now = Date.parse('2026-11-10T02:00:00Z');
const proof = { lastProofAt: '2026-11-10T01:00:00Z', proofAgeLimitSeconds: 3600 };
// All numbers here are test inputs, never production defaults.
test('unset age limit always reports that it is unset, even without a proof', () => {
  for (const data of [{}, { ...proof, proofAgeLimitSeconds: null }, { lastProofAt: 'invalid' }]) {
    assert.equal(proofStatus(data, now), 'proof age limit not set');
  }
});
test('proof expires strictly after the configured limit and remains closed at every age', () => {
  assert.match(proofStatus(proof, now), /within.*closed/);
  assert.match(proofStatus(proof, now + 1), /Warning:.*older.*closed/);
  assert.match(proofStatus({ ...proof, proofAgeLimitSeconds: 0 }, now), /Warning:/);
});
test('invalid limits cannot mark a proof as fresh', () => {
  for (const limit of [-1, '', '3600', false, NaN, Infinity]) {
    assert.match(proofStatus({ ...proof, proofAgeLimitSeconds: limit }, now), /invalid.*closed/);
  }
});
test('missing, invalid, normalized, timezone-less and future proof times stay closed', () => {
  for (const value of [null, '', 'not a date', '2026-02-30T01:00:00Z', '2026-11-10T01:00:00', '2026-11-10T03:00:00Z']) {
    assert.match(proofStatus({ ...proof, lastProofAt: value }, now), /missing|invalid|future/);
    assert.match(proofStatus({ ...proof, lastProofAt: value }, now), /closed/);
  }
});
test('fees have no default; explicit zero is preserved; invalid values are refused', () => {
  assert.equal(feeText(null), 'Fee not set');
  assert.equal(feeText(undefined), 'Fee not set');
  assert.equal(feeText(0), '0 bps (0%)');
  assert.equal(feeText(17), '17 bps (0.17%)');
  for (const value of [-1, '17', '', false, NaN, Infinity]) assert.match(feeText(value), /invalid/);
});
test('wallet connect requests only accounts and returns only an address', async () => {
  const calls = [];
  const address = `0x${'1'.repeat(40)}`;
  const result = await readWalletAddress({ request: async request => { calls.push(request); return [address]; } });
  assert.equal(result, address);
  assert.deepEqual(calls, [{ method: 'eth_requestAccounts' }]);
});
test('missing wallet, rejection and invalid account responses are handled as failures', async () => {
  await assert.rejects(readWalletAddress(null));
  await assert.rejects(readWalletAddress({ request: async () => { throw new Error('User rejected'); } }));
  for (const response of [[], null, ['bad'], '0x123']) {
    await assert.rejects(readWalletAddress({ request: async () => response }));
  }
});
