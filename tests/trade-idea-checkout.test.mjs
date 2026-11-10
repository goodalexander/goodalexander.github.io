import assert from 'node:assert/strict';
import test from 'node:test';
import { eligibilityStatus, feeText, proofStatus, readWalletAddress } from '../static/trade-idea-checkout.mjs';

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

// Plan 03 W3 checkout boundary: the eligibility record gate. The base record
// mirrors the real TSLA record emitted by navstrategies.idea_generator.
//eligibility (values quoted from the 2026-11-10 gate output).
const eligNow = Date.parse('2026-11-10T12:00:00Z');
const base = {
  schema_version: 1,
  record: { instrument_id: 'xyz:TSLA', direction: 'SHORT', family: 'equity' },
  result: {
    eligible: true, refusal: null,
    model: { model_id: 'TSLA', state: 'accepted',
             version: 'sha256:838b4d265470f8e23ee3a8be62e1bf1ab3f8fd997c87d5f7683c5ba4852593af',
             source_date: '2026-11-09' },
  },
  valid_until: '2026-11-14T00:00:00Z',
};
test('an approving, unexpired record is the only state that is not refused', () => {
  assert.match(eligibilityStatus(base, eligNow), /approves this idea until/);
});
test('a missing or empty eligibility record refuses checkout', () => {
  for (const record of [null, undefined, {}, 'record', []]) {
    assert.match(eligibilityStatus(record, eligNow), /No eligibility record|invalid/);
  }
});
test('every refusal code closes checkout with the code named', () => {
  for (const refusal of ['no_model', 'stale', 'flat', 'conflicting', 'changed_signal', 'opposes_systematic']) {
    const record = { ...base, result: { ...base.result, eligible: false, refusal } };
    const text = eligibilityStatus(record, eligNow);
    assert.match(text, new RegExp(`Eligibility refused \\(${refusal}\\)`), refusal);
    assert.match(text, /Buying is closed/);
  }
});
test('a record that is not refused but not approved also closes checkout', () => {
  assert.match(eligibilityStatus({ ...base, result: { eligible: false, refusal: null } }, now), /does not approve/);
  assert.match(eligibilityStatus({ ...base, result: null }, eligNow), /no result/);
});
test('an expired validity window closes checkout even when the result approves', () => {
  assert.match(eligibilityStatus(base, Date.parse('2026-11-15T00:00:01Z')), /expired/);
});
test('invalid, local-time, malformed and future-anchored validity windows close checkout', () => {
  for (const valid_until of [null, '', 'not a date', '2026-02-30T00:00:00Z', '2026-11-14T00:00:00', 3600]) {
    assert.match(eligibilityStatus({ ...base, valid_until }, eligNow), /missing or invalid/i, String(valid_until));
  }
});
