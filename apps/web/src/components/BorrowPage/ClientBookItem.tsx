'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import ja from 'date-fns/locale/ja';
import type { FC, ComponentPropsWithoutRef } from 'react';
import { z } from 'zod';
import { ClientUserAvatar } from './ClientUserAvatar';
import { Image } from '@/components/Image/Image';
import { Link } from '@/components/Link/Link';
import type { Book } from '@/models/book';
import { BookSchema } from '@/models/book';
import { TransactionSchema } from '@/models/transaction';
import { cn } from '@/utils/cn';

const BookWithTransactionsSchema = BookSchema.extend({ transactions: z.array(TransactionSchema).nullable() });

type BookItemProps = ComponentPropsWithoutRef<'div'> & Pick<Book, 'id'>;

export const ClientBookItem: FC<BookItemProps> = ({ id, className, ...props }) => {
  const {
    data: bookWithTransactions,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await fetch(`/api/book/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const parsedResponse = BookWithTransactionsSchema.parse(await response.json());
      return parsedResponse;
    },
    // refetchInterval: 30000, // 30秒ごとに再取得
  });

  if (isLoading) {
    return <div>本 {id} を読み込み中...</div>;
  }

  if (isError) {
    return (
      <div>
        本 {id} の読み込み時にエラーが発生しました: {String(error)}
      </div>
    );
  }

  const { title, image, author, availableDays, createdAt, transactions } = bookWithTransactions;
  const activeTransaction = transactions?.find((transaction) => transaction.returnedAt === null);

  return (
    <div className={cn('flex flex-row items-stretch justify-start gap-3', className)} {...props}>
      <div className="flex w-32 shrink-0 items-center justify-center overflow-hidden bg-keyplate-3 p-2">
        {image ? (
          <div className="relative h-full w-full">
            <Link href={`/book/${id}`}>
              <Image src={image} alt={`${title} の表紙の画像`} fill className="object-contain" />
            </Link>
          </div>
        ) : (
          <span className="text-4xl">📚</span>
        )}
      </div>
      <div className="flex grow flex-col items-start justify-center gap-2 py-1">
        <ul className="flex flex-row items-center justify-start gap-1">
          {activeTransaction ? (
            <li className="rounded-full bg-danger-4 px-3 py-2 text-xs font-bold text-danger-11">❌ 貸出中</li>
          ) : (
            <li className="rounded-full bg-info-4 px-3 py-2 text-xs font-bold text-info-11">✅ 貸出可能</li>
          )}
          <li className="rounded-full bg-warning-4 px-3 py-2 text-xs font-bold text-warning-11">
            ⏳ 最長{availableDays ? availableDays : ' ? '}日間まで
          </li>
        </ul>
        <hgroup className="flex flex-col items-start justify-center gap-1">
          <h2 className="text-lg font-bold">
            <Link href={`/book/${id}`}>{title}</Link>
          </h2>
          {author && <p className="text-xs text-keyplate-11">{author}</p>}
          {createdAt && (
            <p className="text-xs text-keyplate-11">{`${formatDistance(createdAt, new Date(), {
              locale: ja,
              addSuffix: true,
            })} に取扱開始`}</p>
          )}
        </hgroup>
        {activeTransaction && activeTransaction.userId && (
          <div className="flex flex-row items-center justify-start gap-3">
            {/* <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-keyplate-4">
              {userImage ? (
                <Image src={userImage} alt={`${title} を借りているユーザーの画像`} fill className="object-cover" />
              ) : (
                <span>👫</span>
              )}
            </div> */}
            <ClientUserAvatar userId={activeTransaction.userId} showName={false} />
            <p className="rounded-full bg-keyplate-4 px-3 py-2 text-xs font-bold text-keyplate-11">{`${formatDistance(
              activeTransaction.dueAt,
              new Date(),
              {
                locale: ja,
                addSuffix: true,
              },
            )} まで貸出予定`}</p>
          </div>
        )}
      </div>
    </div>
  );
};
