export interface Interface {
  interfaceName: string
  privateKey: string
  publicKey: string
  listenPort: number
  fwmark: number | 'off'
  peers: Peer[]
}

export interface Peer {
  peerPublicKey: string
  presharedKey: string
  endpoint: string
  allowedIps: string
  latestHandshake: number
  transferRx: number
  transferTx: number
  persistentKeepalive: number | 'off'
}