/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BookSchema } from '@/models/book';
import { TransactionSchema } from '@/models/transaction';
import { prismaClient } from '@/utils/prisma/client';

// export const revalidate = 10;

const BookStatusSchema = BookSchema.extend({ transactions: z.array(TransactionSchema).nullable() });

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

  const bookStatusResponse = BookStatusSchema.parse(book);

  // book をjSONにして返す
  return NextResponse.json(bookStatusResponse);
}
