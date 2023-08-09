import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string(), // 4バイトの16進数は最大8文字になります
  title: z.string().min(1),
  image: z.string().url().optional(),
  author: z.string().optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  isbn: z.string().optional(),
  availableDays: z.number().min(1),
  // `transactions` は省略。関連付けのためのフィールドなので、バリデーションスキーマで必要とされない場合もあります。
});

export type Book = z.infer<typeof BookSchema>;
