import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRequestClearBag, useValidClearBag } from '@/hooks/useClearBag';
import { useGetListPlayers, useGetListServer } from '@/hooks/usePlayer';

// Form schemas
const requestFormSchema = z.object({
  serverId: z.string({
    required_error: 'Vui lòng chọn server',
  }),
  playerId: z.string({
    required_error: 'Vui lòng chọn nhân vật',
  }),
});

const verificationFormSchema = z.object({
  code: z.string().min(6, 'Mã xác thực phải có ít nhất 6 ký tự'),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

const ClearBagPasswordPage: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [selectedServerId, setSelectedServerId] = useState<string>('');

  // Hooks
  const { serverData, isLoading: loadingServers } = useGetListServer(true);
  const { playerData, isLoading: loadingPlayers } = useGetListPlayers(selectedServerId, false);
  const { requestClearBag, isLoading: isRequestingClear } = useRequestClearBag();
  const { validClearBag, isLoading: isValidating } = useValidClearBag();

  // Forms
  const requestForm = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      serverId: '',
      playerId: '',
    },
  });

  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleServerChange = (value: string) => {
    setSelectedServerId(value);
    requestForm.setValue('serverId', value);
    requestForm.setValue('playerId', '');
  };

  const onRequestSubmit = async (values: RequestFormValues) => {
    console.log(values);
    try {
      const response = await requestClearBag();

      if (response) {
        setStep('verify');
        toast({
          title: 'Thành công',
          description: 'Vui lòng kiểm tra email để lấy mã xác thực',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    }
  };

  const onVerificationSubmit = async (values: VerificationFormValues) => {
    try {
      const response = await validClearBag({ code: values.code });

      if (response) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa mật khẩu túi đồ thành công',
        });
        // Reset forms and state
        requestForm.reset();
        verificationForm.reset();
        setSelectedServerId('');
        setStep('request');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    }
  };

  if (step === 'verify') {
    return (
      <div className="container mx-auto max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Xác thực xóa mật khẩu túi đồ</CardTitle>
            <CardDescription>Vui lòng nhập mã xác thực đã được gửi đến email của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-6">
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
                      setStep('request');
                      verificationForm.reset();
                    }}
                  >
                    Quay lại
                  </Button>
                  <Button type="submit" disabled={isValidating}>
                    {isValidating ? 'Đang xác thực...' : 'Xác thực'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Xóa mật khẩu túi đồ</CardTitle>
          <CardDescription>Mật khẩu rương và câu hỏi bảo mật sẽ bị xóa khi thực hiện hành động này.</CardDescription>
          <CardDescription>Người chơi cần tải lại game khi tiến hành xóa mật khẩu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-6">
              {/* Server Selection */}
              <FormField
                control={requestForm.control}
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
                control={requestForm.control}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  requestForm.formState.isSubmitting ||
                  loadingPlayers ||
                  !selectedServerId ||
                  !requestForm.formState.isValid ||
                  isRequestingClear
                }
              >
                {isRequestingClear ? 'Đang xử lý...' : 'Xóa mật khẩu rương'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClearBagPasswordPage;
