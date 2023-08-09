'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import type { FC } from 'react';
import { useMemo } from 'react';
import { Link } from '@/components/Link/Link';

export const NavLinks: FC = () => {
  const user = useUser();
  const hasUserLoggedIn = useMemo(() => user?.isSignedIn, [user]);
  return (
    <ul className="flex shrink grow flex-row items-center justify-between truncate">
      <li className="inline-flex shrink truncate">
        <Link
          title="本を探す"
          href="/"
          className="truncate rounded-full px-1.5 py-2 no-underline hover:bg-primary-3 hover:text-primary-11 tablet:px-4"
        >
          本を探す
        </Link>
      </li>
      {hasUserLoggedIn ? (
        <>
          <li className="inline-flex shrink truncate">
            <Link
              title="タグを見る"
              href="/profile"
              className="truncate rounded-full px-1.5 py-2 no-underline hover:bg-primary-3 hover:text-primary-11 tablet:px-4"
            >
              プロフィール
            </Link>
          </li>
          <li>
            <UserButton afterSignOutUrl="/" />
          </li>
        </>
      ) : (
        <>
          <li className="inline-flex shrink truncate">
            <Link
              title="ログイン"
              href="/sign-in/"
              className="truncate rounded-full px-1.5 py-2 no-underline hover:bg-primary-3 hover:text-primary-11 tablet:px-4"
            >
              ログイン
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};
