import fetch from 'node-fetch';

export async function getBalances(wallet) {
  const rpc = 'https://base-rpc.publicnode.com';
  const NPT_CONTRACT = '0xB8c2CE84F831175136cebBFD48CE4BAb9c7a6424';

  const [ethRes, nptRes] = await Promise.all([
    fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [wallet, 'latest'] })
    }),
    fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 2, method: 'eth_call',
        params: [{ to: NPT_CONTRACT, data: '0x70a08231000000000000000000000000' + wallet.replace(/^0x/, '') }, 'latest']
      })
    }),
  ]);

  const ethBalance = parseInt((await ethRes.json()).result, 16) / 1e18;
  const nptBalance = parseInt((await nptRes.json()).result, 16) / 1e18;
  return { ethBalance, nptBalance };
}
