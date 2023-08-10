/* eslint-disable import/prefer-default-export */
import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const revalidate = 300;

const UserInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const user = await clerkClient.users.getUser(params.userId);
  const { firstName, lastName, username, imageUrl } = user;
  const userInfoResponse = UserInfoSchema.parse({
    firstName,
    lastName,
    username,
    imageUrl,
  });

  //  JSONにして返す
  return NextResponse.json(userInfoResponse);
}
