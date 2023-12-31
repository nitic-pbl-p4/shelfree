/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BookSchema } from '@/models/book';
import { TransactionSchema } from '@/models/transaction';
import { prismaClient } from '@/utils/prisma/client';

// export const revalidate = 10;

const BookWithTransactionsSchema = BookSchema.extend({ transactions: z.array(TransactionSchema).nullable() });

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
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

  const bookStatusResponse = BookWithTransactionsSchema.parse({
    ...book,
    updatedAt: book?.updatedAt?.toISOString(),
    createdAt: book?.createdAt?.toISOString(),
    checkedOutAt: book?.transactions?.[0]?.checkedOutAt?.toISOString(),
  });

  // book をjSONにして返す
  return NextResponse.json(bookStatusResponse);
}
