import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { BookItem } from '@/components/BookItem/BookItem';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { prismaClient } from '@/utils/prisma/client';

export const revalidate = 10;

const Home = async () => {
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  // Transactionsも含めて取得する
  // ただし、returnedAtがnullのもののみ選ぶ
  const books = await prismaClient.book.findMany({
    where: {
      transactions: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      transactions: {
        where: {
          returnedAt: null,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden text-keyplate-12">
      <article className="flex w-full max-w-4xl flex-col items-stretch justify-start gap-4 p-6">
        <hgroup className="flex flex-col items-center justify-start">
          <h1 className="my-6 w-full text-center text-4xl font-bold leading-normal text-keyplate-12">
            👤 プロフィール
          </h1>
          <UserAvatar userId={user.id} showName />
        </hgroup>
        <h2 className="text-2xl font-bold">📚 本の貸出履歴</h2>
        <section className="flex w-full flex-col items-stretch justify-start gap-4 overflow-hidden desktop:flex-row desktop:flex-wrap">
          {books.map((book) => {
            const ongoingTransaction = book.transactions.find((transaction) => transaction.returnedAt === null);
            const transactionInfo = ongoingTransaction
              ? {
                  userId: ongoingTransaction.userId,
                  dueAt: ongoingTransaction.dueAt,
                }
              : {};
            return (
              <BookItem
                key={book.id}
                className="w-full max-w-sm"
                {...{
                  id: book.id,
                  title: book.title,
                  image: book.image || undefined,
                  author: book.author || undefined,
                  createdAt: book.createdAt || undefined,
                  availableDays: book.availableDays,
                }}
                {...transactionInfo}
              />
            );
          })}
        </section>
        <section className="flex w-full flex-col items-start justify-start">
          <h2>履歴の詳細</h2>
          <pre className="w-full whitespace-pre-wrap break-all bg-keyplate-3 p-6 font-mono text-sm text-keyplate-11">
            <code>{JSON.stringify(books, null, 2)}</code>
          </pre>
        </section>
        <section className="flex w-full flex-col items-start justify-start">
          <h2>ユーザーの詳細</h2>
          <code className="flex w-full items-start justify-start overflow-hidden text-clip bg-keyplate-3 p-4 text-keyplate-11">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </code>
        </section>
      </article>
    </div>
  );
};

export default Home;
