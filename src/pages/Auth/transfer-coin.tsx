import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTransferCoin, useValidTransfer } from '@/hooks/useCoin';
import { useGetCoin, useGetListPlayers, useGetListServer } from '@/hooks/usePlayer';

// Constants for amount validation
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 10000000;

const transferFormSchema = z.object({
  serverId: z.string({
    required_error: 'Vui lòng chọn server',
  }),
  playerId: z.string({
    required_error: 'Vui lòng chọn nhân vật',
  }),
  amount: z.string().refine(
    val => {
      const num = Number(val);
      return !isNaN(num) && num >= MIN_AMOUNT && num <= MAX_AMOUNT;
    },
    { message: `Số coin phải từ ${MIN_AMOUNT.toLocaleString()} đến ${MAX_AMOUNT.toLocaleString()}` }
  ),
});

const verificationFormSchema = z.object({
  code: z.string().min(6, 'Mã xác thực phải có ít nhất 6 ký tự'),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

interface TransferDetails {
  serverId: string;
  playerId: string;
  amount: number;
  serverName?: string;
  playerName?: string;
}

const TransferCoinPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null);

  // Hooks
  const { serverData, isLoading: loadingServers } = useGetListServer(true);
  const { playerData, isLoading: loadingPlayers } = useGetListPlayers(selectedServerId, false);
  const { coinData, isLoading: loadingCoin, refetch: refetchCoin } = useGetCoin(true);
  const { transferCoin } = useTransferCoin();
  const { validTransfer } = useValidTransfer();

  // Transfer form
  const transferForm = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      serverId: '',
      playerId: '',
      amount: '',
    },
  });

  // Verification form
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleServerChange = (value: string) => {
    setSelectedServerId(value);
    transferForm.setValue('serverId', value);
    transferForm.setValue('playerId', '');
  };

  const onSubmit = async (values: TransferFormValues) => {
    try {
      const amount = Number(values.amount);

      // Validate amount against current balance
      if (amount > (coinData?.coin || 0)) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Số coin chuyển không được lớn hơn số coin hiện có',
        });
        return;
      }

      const selectedServer = serverData?.find(s => s.ServerID.toString() === values.serverId);
      const selectedPlayer = playerData?.find(p => p.UserId.toString() === values.playerId);

      const res = await transferCoin({
        server_id: values.serverId,
        player_id: values.playerId,
        coin: amount,
      });

      if (!res) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Đã có lỗi xảy ra khi chuyển coin',
        });
        return;
      }

      // Store transfer details and show verification dialog
      setTransferDetails({
        serverId: values.serverId,
        playerId: values.playerId,
        amount: amount,
        serverName: selectedServer?.ServerName,
        playerName: selectedPlayer?.NickName,
      });
      setShowVerification(true);

      toast({
        title: 'Yêu cầu xác thực',
        description: 'Vui lòng nhập mã xác thực đã được gửi đến email của bạn',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi chuyển coin',
      });
    }
  };

  const handleVerification = async (data: VerificationFormValues) => {
    try {
      if (!transferDetails) return;

      const result = await validTransfer({
        code: data.code,
      });

      if (result) {
        toast({
          title: 'Thành công',
          description: 'Chuyển coin thành công',
        });

        // Reset everything
        transferForm.reset();
        verificationForm.reset();
        setSelectedServerId('');
        setShowVerification(false);
        setTransferDetails(null);
        refetchCoin(); // Refresh coin balance
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Mã xác thực không đúng',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi xác thực',
      });
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-2xl py-8">
        {/* Current Coin Info */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-bold">Số coin hiện tại</CardTitle>
              <CardDescription>Số coin bạn có thể chuyển</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => refetchCoin()} disabled={loadingCoin}>
              <RefreshCw className={`h-4 w-4 ${loadingCoin ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingCoin ? (
                <span className="text-muted-foreground">Đang tải...</span>
              ) : (
                <span>{coinData?.coin.toLocaleString() || 0} coin</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Chuyển coin</CardTitle>
            <CardDescription>Chọn server và nhân vật để chuyển coin</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...transferForm}>
              <form onSubmit={transferForm.handleSubmit(onSubmit)} className="space-y-6">
                {/* Server Selection */}
                <FormField
                  control={transferForm.control}
                  name="serverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server</FormLabel>
                      <Select disabled={loadingServers} onValueChange={handleServerChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingServers ? 'Đang tải...' : 'Chọn server'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serverData?.map(server => (
                            <SelectItem key={server.ServerID} value={server.ServerID.toString()}>
                              {server.ServerName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Player Selection */}
                <FormField
                  control={transferForm.control}
                  name="playerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân vật</FormLabel>
                      <Select
                        disabled={!selectedServerId || loadingPlayers}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedServerId
                                  ? 'Vui lòng chọn server trước'
                                  : loadingPlayers
                                    ? 'Đang tải...'
                                    : 'Chọn nhân vật'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {playerData?.map(player => (
                            <SelectItem key={player.UserId} value={player.UserId.toString()}>
                              {player.NickName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount Input */}
                <FormField
                  control={transferForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số coin chuyển</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`Nhập số coin (${MIN_AMOUNT.toLocaleString()} - ${MAX_AMOUNT.toLocaleString()})`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    transferForm.formState.isSubmitting ||
                    loadingPlayers ||
                    !selectedServerId ||
                    !transferForm.formState.isValid
                  }
                >
                  {transferForm.formState.isSubmitting ? 'Đang xử lý...' : 'Chuyển coin'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác thực chuyển coin</DialogTitle>
            <DialogDescription>
              Vui lòng xác nhận thông tin và nhập mã xác thực đã được gửi đến email của bạn
            </DialogDescription>
          </DialogHeader>

          {/* Transfer Details Summary */}
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Server:</div>
              <div className="font-medium">{transferDetails?.serverName}</div>
              <div className="text-muted-foreground">Nhân vật:</div>
              <div className="font-medium">{transferDetails?.playerName}</div>
              <div className="text-muted-foreground">Số coin:</div>
              <div className="font-medium">{transferDetails?.amount?.toLocaleString()}</div>
            </div>
          </div>

          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(handleVerification)} className="space-y-4">
              <FormField
                control={verificationForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác thực</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập mã xác thực" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowVerification(false);
                    verificationForm.reset();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={verificationForm.formState.isSubmitting}>
                  {verificationForm.formState.isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransferCoinPage;
