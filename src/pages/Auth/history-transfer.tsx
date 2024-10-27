import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetTransferHistory } from '@/hooks/useHistory'; // You'll need to create this hook
import { useGetListServer } from '@/hooks/usePlayer';

interface TransferHistoryItem {
  ID: number;
  UserID: string;
  Type: string;
  TypeCode: string;
  Content: string;
  Value: string;
  TimeCreate: string;
  IPCreate: string;
  ServerID: string;
  Time: string;
}

const TransferHistoryPage: React.FC = () => {
  const { serverData } = useGetListServer(true);
  const { historyData, isLoading } = useGetTransferHistory();

  const getServerName = (serverId: string) => {
    return serverData?.find(server => server.ServerID.toString() === serverId)?.ServerName || serverId;
  };

  const getTypeColor = (typeCode: string) => {
    switch (typeCode) {
      case '1':
        return 'bg-green-100 text-green-800';
      case '2':
        return 'bg-blue-100 text-blue-800';
      case '3':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: vi });
    } catch {
      return dateStr;
    }
  };

  const formatCoin = (value: string) => {
    const num = parseInt(value);
    return num.toLocaleString() + ' VND';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử giao dịch</CardTitle>
            <CardDescription>Đang tải dữ liệu...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>Lịch sử các giao dịch coin của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại giao dịch</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead className="text-right">VND</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData?.map((item: TransferHistoryItem) => (
                  <TableRow key={item.ID}>
                    <TableCell className="font-medium">{formatDateTime(item.Time)}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(item.TypeCode)} variant="secondary">
                        {item.Type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.Content}</TableCell>
                    <TableCell>{getServerName(item.ServerID)}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        item.TypeCode === '1'
                          ? 'text-green-600'
                          : item.TypeCode === '2'
                            ? 'text-blue-600'
                            : 'text-red-600'
                      }`}
                    >
                      {formatCoin(item.Value)}
                    </TableCell>
                  </TableRow>
                ))}
                {(!historyData || historyData.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                      Không có dữ liệu giao dịch
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferHistoryPage;
