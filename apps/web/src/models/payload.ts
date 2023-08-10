import { z } from 'zod';

export const PayloadSchema = z.object({
  book: z.record(z.string().datetime({ offset: true })),
  person: z
    .object({
      id: z.string().min(1),
      seenAt: z.string().datetime({ offset: true }),
    })
    .nullable(),
  timestamp: z.string().datetime({ offset: true }),
  signature: z.string().min(1),
  confirm: z.boolean().optional(),
});
