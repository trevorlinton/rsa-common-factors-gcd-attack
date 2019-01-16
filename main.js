#!/usr/bin/env node
let tls = require('tls')
let url = require('url')
let assert = require('assert')

function gcd(a, b) {
  if (a >= b) {
    return 0n === (a % b) ? b : gcd(a % b, b);
  } else {
    return gcd(b, a);
  }
}

function quasi_linear_gcd(k) {
  assert.ok(k.length % 2 === 0, 'The inputted gcd must be even')
  let j = [], s = [];
  for(let i=0; i < k.length / 2; i++) {
    j[i] = k[i * 2] * k[i * 2 + 1];
  }
  let r = j.map((ji, i) => gcd(ji, j.reduce((a, v, n) => (a * (n === i ? 1n : v)), 1n)))
  for(let i=0; i < k.length/2; i++) {
    s[i * 2]      = gcd(k[i * 2],     r[i] * k[i * 2 + 1])
    s[i * 2 + 1]  = gcd(k[i * 2 + 1], r[i] * k[i * 2])
  }
  return s
}

function linear_gcd(k) {
  assert.ok(k.length % 2 === 0, 'The inputted gcd must be even')
  return k.map((ki, i) => gcd(ki, k.reduce((a, v, n) => (a * (n === i ? 1n : v)), 1n)))
}

function get_website_public_key(target_uri) {
  return new Promise((resolve, reject) => {
    let uri = url.parse(target_uri)
    let host = uri.hostname || uri.path
    let port = uri.port || 443
    const socket = tls.connect({host, port, "servername":host})
    socket.on('secureConnect', () => {
      let peer = socket.getPeerCertificate(true);
      let cert = peer.raw;
      let key = peer.pubkey;
      let bits = peer.bits;
      let modulus = BigInt("0x" + peer.modulus);
      let exponent = BigInt(peer.exponent);
      socket.end()
      resolve({ exponent, modulus, cert, key, bits });
    })
    socket.on('error', (e) => reject(e))
  })
}

if (require.main === module) {
  console.log('quasi linear gcd tests:',  quasi_linear_gcd([21n, 7n, 14n, 121n]))
  console.log('linear gcd tests:',    quasi_linear_gcd([21n, 7n, 14n, 121n]))
  get_website_public_key(process.argv[2])
    .then((res) => console.log(res))
    .catch((e) => console.error(e));
}