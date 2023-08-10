'use client';

import { useQuery } from '@tanstack/react-query';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

type ClientUserAvatarProps = Omit<ComponentPropsWithoutRef<typeof Avatar>, 'src'> & {
  userId: string;
  showName?: boolean;
};

export const ClientUserAvatar: FC<ClientUserAvatarProps> = ({ userId, showName, ...props }) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userinfo = UserInfoSchema.parse(await response.json());
      return userinfo;
    },
  });

  if (isLoading) {
    return <div>ユーザー {userId} を読み込み中...</div>;
  }

  if (isError) {
    return (
      <div>
        ユーザー {userId} の読み込み時にエラーが発生しました: {String(error)}
      </div>
    );
  }

  const { firstName, lastName, username, imageUrl } = data;

  return (
    <div className="flex flex-row items-center justify-start gap-3">
      <Avatar {...props}>
        <AvatarFallback>{firstName}</AvatarFallback>
        <AvatarImage src={imageUrl} />
      </Avatar>
      {showName && (
        <p className="font-bold">
          {firstName} {lastName} <span className="font-mono text-keyplate-11">(@{username})</span>
        </p>
      )}
    </div>
  );
};
