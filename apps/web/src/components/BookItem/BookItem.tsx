import { formatDistance } from 'date-fns';
import ja from 'date-fns/locale/ja';
import type { FC, ComponentPropsWithoutRef } from 'react';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { Image } from '@/components/Image/Image';
import { Link } from '@/components/Link/Link';
import type { Book } from '@/models/book';
import { cn } from '@/utils/cn';

type BookItemProps = ComponentPropsWithoutRef<'div'> &
  Pick<Book, 'author' | 'availableDays' | 'createdAt' | 'image' | 'title' | 'id' | 'ownerMessage' | 'ownerUserId'> & {
    userId?: string; // 借りている人
    dueAt?: Date; // 返却期限
    showOwner?: boolean;
  };

export const BookItem: FC<BookItemProps> = ({
  id,
  title,
  image,
  author,
  availableDays,
  createdAt,
  userId,
  dueAt,
  ownerMessage,
  ownerUserId,
  showOwner,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col items-stretch justify-center gap-1', className)} {...props}>
      <div className="flex h-48 flex-row items-stretch justify-start gap-3">
        <div className="flex w-32 shrink-0 items-center justify-center overflow-hidden bg-keyplate-3 p-2">
          {image ? (
            <div className="relative h-full w-full">
              <Link href={`/book/${id}`}>
                <Image src={image} alt={`${title} の表紙の画像`} fill className="object-contain" />
              </Link>
            </div>
          ) : (
            <span className="text-4xl">📚</span>
          )}
        </div>
        <div className="flex grow flex-col items-start justify-center gap-2 py-1">
          <ul className="flex flex-row items-center justify-start gap-1">
            {dueAt ? (
              <li className="rounded-full bg-danger-4 px-3 py-2 text-xs font-bold text-danger-11">❌ 貸出中</li>
            ) : (
              <li className="rounded-full bg-info-4 px-3 py-2 text-xs font-bold text-info-11">✅ 貸出可能</li>
            )}
            <li className="rounded-full bg-warning-4 px-3 py-2 text-xs font-bold text-warning-11">
              ⏳ 最長{availableDays ? availableDays : ' ? '}日間まで
            </li>
          </ul>
          <hgroup className="flex flex-col items-start justify-center gap-1">
            <h2 className="text-lg font-bold">
              <Link href={`/book/${id}`}>{title}</Link>
            </h2>
            {author && <p className="text-xs text-keyplate-11">{author}</p>}
            {createdAt && (
              <p className="text-xs text-keyplate-11">{`${formatDistance(createdAt, new Date(), {
                locale: ja,
                addSuffix: true,
              })} に取扱開始`}</p>
            )}
          </hgroup>
          {dueAt && userId && (
            <div className="flex flex-row items-center justify-start gap-3">
              {/* <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-keyplate-4">
              {userImage ? (
                <Image src={userImage} alt={`${title} を借りているユーザーの画像`} fill className="object-cover" />
              ) : (
                <span>👫</span>
              )}
            </div> */}
              <UserAvatar userId={userId} showName={false} />
              <p className="rounded-full bg-keyplate-4 px-3 py-2 text-xs font-bold text-keyplate-11">{`${formatDistance(
                dueAt,
                new Date(),
                {
                  locale: ja,
                  addSuffix: true,
                },
              )} まで貸出予定`}</p>
            </div>
          )}
        </div>
      </div>
      {showOwner && ownerUserId && (
        <div className="flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-keyplate-1 p-6">
          <UserAvatar userId={ownerUserId} showName={true} />
          <h3 className="text-xs font-bold text-keyplate-11">本の持ち主からのひとこと</h3>
          <p className="italic">
            &ldquo;{ownerMessage}&rdquo;<span className="text-keyplate-11"> － ぜひ借りてみましょう！</span>
          </p>
        </div>
      )}
    </div>
  );
};
