import type { FC } from 'react';
import { BookItem } from '@/components/BookItem/BookItem';
import { prismaClient } from '@/utils/prisma/client';

export const revalidate = 10;

const Home = async () => {
  // Transactionsも含めて取得する
  // ただし、returnedAtがnullのもののみ選ぶ
  const books = await prismaClient.book.findMany({
    include: {
      transactions: {
        where: {
          returnedAt: null,
        },
      },
    },
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-keyplate-12">
      <article className="flex max-w-4xl flex-col gap-4 p-6">
        <h1 className="my-6 text-center text-5xl font-bold leading-normal text-keyplate-12">本を探す</h1>
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
          <pre className="w-full whitespace-pre-wrap break-all bg-keyplate-3 p-6 font-mono text-sm text-keyplate-11">
            <code>{JSON.stringify(books, null, 2)}</code>
          </pre>
        </section>
      </article>
    </div>
  );
};

export default Home;
