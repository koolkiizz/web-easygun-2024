export interface ServerItem {
  ServerID: number;
  ServerName: string;
}

export interface PlayerItem {
  UserId: string;
  NickName: string;
}

export interface PlayerPayload {
  server_id: string;
}

export interface CoinInfo {
  coin: number;
}
