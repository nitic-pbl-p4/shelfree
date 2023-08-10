/* eslint-disable import/prefer-default-export */
import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
// import { z } from 'zod';
import { PayloadSchema } from '@/models/payload';
import { prismaClient } from '@/utils/prisma/client';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // ペイロードとは... 貸し出し処理を行うために必要な情報をまとめたもの 💬
    // 例
    // {
    // "book": {
    //   "eeacc91e": "2023-08-10T18:05:10.730932Z",
    //   "fbf5c91e": "2023-08-10T18:05:19.942218Z"
    // },
    // "person": { "id": "reohakuta", "seenAt": "2023-08-10T14:14:15.118196Z" },
    // "signature": "I58L1oqeqb5pQgGD19mA797L+D4UBxYs1yGFTkhePUreJ9SwQQf3hoR2fZYDxUzok2w5wlhiYbHuXAuuQ21F9ktSwmnZeQ/abEQNiobbzcX6Z8x9UhXfmOn7RWv3y0hIXgleo5YuT/Qt19C4iBi8h6HqlvQFL4D+63OlcAIhuzNjUvqyndTYd+eEYH3PAfUteF3VVMW6P2DHoQBdPfPuI1nFfVF9hfA1u7hCteJBvaroG9RzZ3G4yXOAgmJ+kCuu5UNQeaCm3dJI0a1QqEHitwaTUDCnjegFsDrpcdHXH/Cyi6XNS2n4ZZSBf5MLHLaluibZeUksn7ETNQV/9QB3+g==",
    // "timestamp": "2023-08-10T14:14:15.151809Z"
    // }

    const rawPayload = await request.json();

    const payload = PayloadSchema.parse(rawPayload);

    // ペイロードの署名を確認
    // TODO ！！！！！！！！！！！！！！！！！！！！！！！！
    const publicKey = fs.readFileSync('public_key.pem', 'utf8');
    const signature = payload.signature;
    delete payload.signature; // 署名部分を一時的に削除

    // ペイロードを文字列に変換
    const payloadString = JSON.stringify(payload);

    // 署名をBase64デコードしてバッファに変換
    const signatureBuffer = Buffer.from(signature, 'base64');

    // ペイロードのハッシュを計算
    const hash = crypto.createHash('sha256').update(payloadString).digest();

    // 署名の検証
    const isVerified = crypto.verify(
      'sha256',
      Buffer.from(hash),
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
      signatureBuffer
    );


    // ここに署名の検証処理を書く
    if (!isVerified) {
      // 書き換える
      throw new Error('署名が不正です。改竄の可能性があるので、貸し出し処理を中止します');
    }

    // ペイロードが確認済みであることを確認
    if (!payload.confirm) {
      throw new Error('ペイロードが確認されている貸し出し処理用のものではありません');
    }

    // ペイロードのタイムスタンプを確認
    // もし1時間以上前のものであればエラー
    if (new Date(payload.timestamp).getTime() < Date.now() - 1000 * 60 * 60) {
      throw new Error('タイムスタンプが古すぎます');
    }

    // ユーザーが存在するか確認
    if (!payload.person || !payload.person.id) {
      throw new Error('ユーザーIDが与えられていません');
    }
    const user = await clerkClient.users.getUser(payload.person.id);
    if (!user) {
      throw new Error('指定されたユーザーが存在しません');
    }

    // ユーザーが顔認証された日時が5分前よりも古い場合はエラー
    if (new Date(payload.person.seenAt).getTime() < Date.now() - 1000 * 60 * 5) {
      throw new Error('ユーザーが顔認証した日時が古すぎます。再度顔認証を行い、5分以内に貸し出し処理を行ってください');
    }

    // 対象の本が存在して、尚且つ貸し出し中でないことを確認
    const bookIds = Object.keys(payload.book);

    const bookPromises = bookIds.map(async (bookId) => {
      const book = await prismaClient.book.findUnique({
        where: {
          id: bookId,
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
        throw new Error(
          `指定されたId "${bookId}" を持つ本は存在しません。同時に貸し出し要求された本の処理も全て中止します`,
        );
      }
      if (book.transactions.length > 0) {
        throw new Error(
          `指定されたId "${bookId}" を持つ本 "${book.title}" は貸し出し中です。同時に貸し出し要求された本の処理も全て中止します`,
        );
      }
      return book;
    });

    // 全ての非同期処理が完了するのを待つ
    const books = await Promise.all(bookPromises);

    // 貸し出し処理を実行
    const borrowPromises = books.map(async (book) => {
      await prismaClient.transaction.create({
        data: {
          book: {
            connect: {
              id: book.id,
            },
          },
          userId: user.id,
          // 期限は book.availableDays で指定された日数後
          dueAt: new Date(Date.now() + book.availableDays * 24 * 60 * 60 * 1000),
        },
      });
    });

    // 全ての非同期処理が完了するのを待つ
    await Promise.all(borrowPromises);

    return NextResponse.json(
      {
        message: '貸し出し処理に成功しました',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user.id,
          imageUrl: user.imageUrl,
          username: user.username,
        },
        bookIds,
      },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        {
          message: e.message,
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          message: '不明なエラーが発生しました',
        },
        { status: 400 },
      );
    }
  }
}
