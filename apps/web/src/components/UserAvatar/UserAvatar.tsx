import { clerkClient } from '@clerk/nextjs';

import type { ReactElement, ComponentPropsWithoutRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = Omit<ComponentPropsWithoutRef<typeof Avatar>, 'src'> & {
  userId: string;
  showName?: boolean;
};

export const UserAvatar = async ({ userId, showName, ...props }: UserAvatarProps): Promise<ReactElement> => {
  const { firstName, lastName, username, imageUrl } = await clerkClient.users.getUser(userId);
  return (
    <div className="flex flex-row items-center justify-start gap-3">
      <Avatar {...props}>
        <AvatarFallback>{firstName}</AvatarFallback>
        <AvatarImage src={imageUrl} alt={`${firstName} ${lastName} のアイコン`} />
      </Avatar>
      {showName && (
        <p className="font-bold">
          {firstName} {lastName} <span className="font-mono text-keyplate-11">(@{username})</span>
        </p>
      )}
    </div>
  );
};
