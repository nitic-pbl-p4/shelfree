'use client';

import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useCallback } from 'react';
import { ClientBookItem } from './ClientBookItem';
import { ClientUserAvatar } from './ClientUserAvatar';
// import { prismaClient } from '@/utils/prisma/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PayloadSchema } from '@/models/payload';

export const BorrowPage: FC = () => {
  // const { data, error, isLoading, isError } = useQuery(['fetchData'], fetcher, {
  //   refetchInterval: 2000, // 2秒ごとに再取得
  // });

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['payload'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const rawPayload = await response.text();
      const payload = PayloadSchema.parse(JSON.parse(rawPayload));
      return {
        payload,
        rawPayload,
      };
    },
    refetchInterval: 2000, // 2秒ごとに再取得
  });

  const { toast } = useToast();

  const onReset = useCallback(async () => {
    await fetch('http://localhost:5000/confirm');
    toast({
      title: 'リセットしました',
      description: '現在選んでいる本と貸りる人の情報をリセットしました。',
    });
  }, [toast]);

  const onBorrow = useCallback(async () => {
    try {
      toast({
        title: '貸し出し処理を開始します',
        description: '完了まで数秒ほどお待ちください。',
      });

      const confirmResponse = await fetch('http://localhost:5000/confirm');
      if (!confirmResponse.ok) {
        throw new Error('貸し出し処理用の確認ペイロードの取得に失敗しました');
      }
      const rawConfirmPayload = await confirmResponse.text();

      const response = await fetch('/api/book/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: rawConfirmPayload,
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} / ${response.statusText} / ${await response?.text()}`,
        );
      }

      // 成功時の処理
      toast({
        title: '本を貸し出しました',
        description: `選択されていた全ての本について手続きが成功しました。ご利用ありがとうございました。${await response.text()}`,
      });
    } catch (e) {
      // エラー時の処理
      toast({
        variant: 'destructive',
        title: '本の貸し出し処理時にエラーが発生しました',
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }, [toast]);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (isError) {
    return <div>エラー: {String(error)}</div>;
  }

  const { payload: payloadData } = data;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-keyplate-12">
      <article className="flex max-w-4xl flex-col gap-4 p-6">
        <h1 className="my-6 text-center text-5xl font-bold leading-normal text-keyplate-12">本を貸りる</h1>
        <section className="flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-keyplate-1 p-6">
          {payloadData.person ? (
            <>
              <h2 className="text-2xl font-bold">👤 本を貸りようとしている人</h2>
              <ClientUserAvatar userId={payloadData.person.id} showName={true} />
              <p className="w-full text-right text-xs text-keyplate-11">
                参考顔画像の個人登録Id: <span className="font-mono font-bold">{payloadData.person.id}</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">💡 カメラに顔を映して顔認証して下さい</h2>
            </>
          )}
        </section>
        <section className="flex w-full flex-col items-stretch justify-start gap-4 overflow-hidden desktop:flex-row desktop:flex-wrap">
          {Object.keys(payloadData.book).map((bookId) => (
            <ClientBookItem key={bookId} id={bookId} />
          ))}
        </section>
        <section className="flex w-full flex-row items-center justify-end gap-2 rounded-lg bg-keyplate-1 p-6">
          <p className="mr-6 text-xl font-bold">📚 現在、{Object.keys(payloadData.book).length}冊の本を選択中です</p>
          <Button variant={'destructive'} onClick={onReset}>
            リセット
          </Button>
          <Button className="font-bold" onClick={onBorrow}>
            本を貸りる
          </Button>
        </section>
        <section className="flex w-full flex-col items-start justify-start">
          <pre className="w-full whitespace-pre-wrap break-all bg-keyplate-3 p-6 font-mono text-sm text-keyplate-11">
            <code>{JSON.stringify(payloadData, null, 2)}</code>
          </pre>
        </section>
      </article>
    </div>
  );
};
