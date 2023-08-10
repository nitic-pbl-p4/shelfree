import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.number(),
  bookId: z.string().min(1).max(8),
  checkedOutAt: z.coerce.date(),
  dueAt: z.coerce.date(),
  returnedAt: z.coerce.date().nullable().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
  userId: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
