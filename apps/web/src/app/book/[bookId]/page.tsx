// import { clerkClient } from '@clerk/nextjs';
// import { User } from '@clerk/nextjs/dist/types/server';
import { format } from 'date-fns';
import ja from 'date-fns/locale/ja';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { Image } from '@/components/Image/Image';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { prismaClient } from '@/utils/prisma/client';

// const knownBooks: Record<
//   string,
//   {
//     name: string;
//     image?: string;
//   }
// > = {
//   '7663cf25': {
//     name: '最果タヒ (新潮文庫)',
//     image: '/book/saihatetahi.jpeg',
//   },
//   '123456ab': {
//     name: 'ハリー・ポッターと賢者の石',
//   },
// };

export const revalidate = 10;
export const runtime = 'nodejs';

type BookDetailPageParams = {
  bookId: string;
};

export const generateStaticParams = async (): Promise<BookDetailPageParams[]> => {
  // return Object.entries(knownBooks).map(([bookId]) => ({ bookId }));

  const books = await prismaClient.book.findMany({
    select: {
      id: true,
    },
  });

  return books.map(({ id }) => ({ bookId: id }));
};

const BookDetailPage = async ({ params }: { params: BookDetailPageParams }): Promise<ReactElement> => {
  const book = await prismaClient.book.findUnique({
    where: {
      id: params.bookId,
    },
    include: {
      transactions: {
        where: {
          returnedAt: null,
        },
      },
    },
  });

  if (!book) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-keyplate-12">
      <article className="flex max-w-2xl flex-col gap-4 p-6">
        <h1 className="my-6 text-center text-5xl font-bold leading-normal text-keyplate-12">📚 {book.title}</h1>
        <section className="flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-keyplate-1 p-6">
          {book.transactions[0] ? (
            <>
              <h2 className="text-2xl font-bold">❌ 現在、この本は貸出中です</h2>
              <UserAvatar userId={book.transactions[0].userId} showName={true} />
              <p>
                🫱{' '}
                <span className="font-bold">
                  {format(book.transactions[0].checkedOutAt, 'yyyy年MM月dd日(E) HH時mm分', { locale: ja })}
                </span>{' '}
                に貸し出し開始
              </p>
              <p>
                📅{' '}
                <span className="font-bold">
                  {format(book.transactions[0].dueAt, 'yyyy年MM月dd日(E) HH時mm分', { locale: ja })}
                </span>{' '}
                までに要返却
              </p>
              <p>📮 まだ返却されていません</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">✅ 現在、この本は貸出可能です</h2>
            </>
          )}
        </section>
        <section>
          <p className="text-center font-mono text-keyplate-11">本のRFIDタグの識別番号: {book.id}</p>
          {book.image && (
            <Image
              src={book.image as string}
              className="relative w-full object-cover"
              width={400}
              height={600}
              alt="本の表紙"
            />
          )}
          {book.ownerUserId && (
            <div className="flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-keyplate-1 p-6">
              <UserAvatar userId={book.ownerUserId} showName={true} />
              <h3 className="text-xs font-bold text-keyplate-11">本の持ち主からのひとこと</h3>
              <p className="italic">
                &ldquo;{book.ownerMessage}&rdquo;<span className="text-keyplate-11"> － ぜひ借りてみましょう！</span>
              </p>
            </div>
          )}
          <h2 className="my-6 text-center text-2xl font-bold leading-normal text-keyplate-12">この本の詳細情報</h2>
          <pre className="w-full whitespace-pre-wrap break-all bg-keyplate-3 p-6 font-mono text-sm text-keyplate-11">
            <code>{JSON.stringify(book, null, 2)}</code>
          </pre>
        </section>
      </article>
    </div>
  );
};

export default BookDetailPage;

export const generateMetadata = async ({ params }: { params: BookDetailPageParams }): Promise<Metadata> => {
  const book = await prismaClient.book.findUnique({
    where: {
      id: params.bookId,
    },
    include: {
      transactions: {
        where: {
          returnedAt: null,
        },
      },
    },
  });

  const metadata: Metadata = {
    title: book?.title || '本の詳細',
  };

  return metadata;
};
