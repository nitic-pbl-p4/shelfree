import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.number(),
  bookId: z.string().min(1).max(8),
  checkedOutAt: z.date(),
  dueAt: z.date(),
  returnedAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
