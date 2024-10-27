export interface BankInfo {
  src: string;
  comment: string;
  accinfo: {
    name: string;
    acc_num: string;
    bank_name: string;
  };
}

export interface TransferCoinPayload {
  server_id: string;
  player_id: string;
  coin: number;
}
