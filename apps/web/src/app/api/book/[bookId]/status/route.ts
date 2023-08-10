/* eslint-disable import/prefer-default-export */
import { prismaClient } from '@/utils/prisma/client';

// export const revalidate = 10;

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

  const isBookAvailable = book?.transactions.length === 0;

  if (!isBookAvailable) {
    // 本が貸し出し中の場合は、404を返す
    return new Response('404 指定された本は現在貸し出し中です', {
      status: 404,
    });
  }

  // 本が貸し出し中でない場合は、200を返す
  return new Response('200 指定された本は現在利用可能です(貸し出し中ではありません)', {
    status: 200,
  });
}
