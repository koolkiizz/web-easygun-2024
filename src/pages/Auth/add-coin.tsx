import { Copy } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankInfo } from '@/hooks/types/coin';
import { useToast } from '@/hooks/use-toast';
import { useGetQRBank } from '@/hooks/useCoin';

const AddCoinPage: React.FC = () => {
  const { toast } = useToast();
  const [activeBank, setActiveBank] = useState<'acb' | 'mb'>('acb');
  const initialLoadDone = useRef(false); // Add ref to track initial load

  const { acbData, mbData, getACBBank, getMBBank, isLoadingACB, isLoadingMB, isErrorACB, isErrorMB } = useGetQRBank();

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialLoadDone.current) return; // Skip if already loaded

      initialLoadDone.current = true; // Mark as loaded before the API call
      try {
        await getACBBank();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải thông tin ngân hàng',
        });
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = async (value: string) => {
    setActiveBank(value as 'acb' | 'mb');
    try {
      if (value === 'acb' && !acbData) {
        await getACBBank();
      } else if (value === 'mb' && !mbData) {
        await getMBBank();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải thông tin ngân hàng',
      });
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Đã sao chép',
      description: `Đã sao chép ${label} vào clipboard`,
    });
  };

  const renderBankInfo = (bankData: BankInfo | undefined, isLoading: boolean, isError: Error | undefined) => {
    if (isLoading || !bankData) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center py-12 text-red-500">
          Đã có lỗi xảy ra khi tải thông tin ngân hàng
        </div>
      );
    }

    return (
      <div className="flex justify-between gap-4">
        {/* QR Code Section */}
        <div className="flex justify-center w-full">
          <div className="relative bg-white p-4 rounded-lg shadow-sm">
            <img
              src={bankData.src}
              alt="QR Code"
              className="w-64 h-64 object-contain"
              onError={e => {
                e.currentTarget.src = '/fallback-qr.png';
              }}
            />
          </div>
        </div>

        {/* Bank Account Information */}
        <div className="space-y-4 bg-muted/50 p-6 rounded-lg w-full">
          <div className="space-y-3">
            {/* Account Name */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Tên tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{bankData.accinfo.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={() => handleCopy(bankData.accinfo.name, 'tên tài khoản')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{bankData.accinfo.acc_num}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={() => handleCopy(bankData.accinfo.acc_num, 'số tài khoản')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Ngân hàng</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{bankData.accinfo.bank_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                  onClick={() => handleCopy(bankData.accinfo.bank_name, 'tên ngân hàng')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Transfer Comment */}
            <div className="pt-3 mt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Nội dung chuyển khoản</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{bankData.comment}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                    onClick={() => handleCopy(bankData.comment, 'nội dung chuyển khoản')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentBankData = activeBank === 'acb' ? acbData : mbData;
  //   const isCurrentLoading = activeBank === 'acb' ? isLoadingACB : isLoadingMB;
  //   const isCurrentError = activeBank === 'acb' ? isErrorACB : isErrorMB;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Nạp tiền vào tài khoản</CardTitle>
          <CardDescription>Quét mã QR hoặc chuyển khoản theo thông tin bên dưới để nạp tiền</CardDescription>
          <CardDescription className="text-red-600">Tỉ lệ chuyển đổi 10,000 VND = 1,000 coin</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="acb" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="acb">ACB Bank</TabsTrigger>
              <TabsTrigger value="mb">MB Bank</TabsTrigger>
            </TabsList>
            <TabsContent value="acb" className="mt-6">
              {renderBankInfo(acbData, isLoadingACB, isErrorACB)}
            </TabsContent>
            <TabsContent value="mb" className="mt-6">
              {renderBankInfo(mbData, isLoadingMB, isErrorMB)}
            </TabsContent>
          </Tabs>

          {/* Instructions */}
          <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
            <p className="font-semibold text-orange-800">Lưu ý quan trọng:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
              <li>Vui lòng chuyển khoản đúng nội dung để được cộng tiền tự động</li>
              <li>Thời gian xử lý từ 1-5 phút sau khi chuyển khoản thành công</li>
              <li>Nếu quá 5 phút chưa nhận được tiền, vui lòng liên hệ với chúng tôi qua chat</li>
              <li>Không sử dụng tiếng Việt có dấu trong nội dung chuyển khoản</li>
            </ul>
          </div>

          {/* Quick Copy All Button */}
          {currentBankData && (
            <div className="pt-4 border-t">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const fullInfo = `Ngân hàng: ${currentBankData.accinfo.bank_name}\nSố tài khoản: ${currentBankData.accinfo.acc_num}\nTên: ${currentBankData.accinfo.name}\nNội dung: ${currentBankData.comment}`;
                  handleCopy(fullInfo, 'toàn bộ thông tin');
                }}
              >
                Sao chép toàn bộ thông tin
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCoinPage;
