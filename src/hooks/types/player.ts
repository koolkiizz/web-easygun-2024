export interface ServerItem {
  ServerID: number;
  ServerName: string;
}

export interface PlayerItem {
  UserID: string;
  NickName: string;
}

export interface PlayerPayload {
  server_id: string;
}

export interface CoinInfo {
  coin: number;
}
