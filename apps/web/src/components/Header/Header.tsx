import { UserButton } from '@clerk/nextjs';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Image } from '@/components/Image/Image';
import { Link } from '@/components/Link/Link';
import DarkLogoImage from '@public/logo/dark.png';
import LightLogoImage from '@public/logo/light.png';

export type HeaderProps = ComponentPropsWithoutRef<'header'>;

export const Header: FC<HeaderProps> = ({ children, ...props }) => (
  <header
    className="sticky top-0 z-30 flex w-full flex-col items-center justify-start bg-keyplate-1 font-bold text-keyplate-12"
    {...props}
  >
    <nav
      aria-label="グローバルバナー"
      className={
        'flex flex-col items-center justify-center gap-1 self-stretch bg-info-9 px-6 py-3 font-bold text-info-1'
      }
    >
      📚必要なのはあなたの顔と貸りたい本だけ！
    </nav>
    <nav
      aria-label="グローバルナビゲーション"
      className="flex w-full max-w-md flex-row flex-nowrap items-stretch justify-center gap-6 px-6 py-3"
    >
      <Link href="/" className="inline-flex shrink-0 items-center duration-100 hover:scale-110 hover:shadow-card">
        <Image
          src={LightLogoImage}
          alt="Shelfreeのロゴ"
          sizes={{
            default: '40vw',
            tablet: '25vw',
            desktop: '20vw',
          }}
          placeholder="blur"
          className="w-40 dark:hidden"
        />
        <Image
          src={DarkLogoImage}
          alt="Shelfreeのロゴ"
          sizes={{
            default: '40vw',
            tablet: '25vw',
            desktop: '20vw',
          }}
          placeholder="blur"
          className="hidden w-40 dark:block"
        />
      </Link>
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
        {/* {/* <li className="inline-flex shrink truncate">
          <Link
            title="タグを見る"
            href="/"
            className="tablet:px-4 truncate rounded-full px-1.5 py-2 no-underline hover:bg-primary-3 hover:text-primary-11"
          >
            規約
          </Link>
        </li> */}
        <li className="inline-flex shrink truncate">
          <Link
            title="ログイン"
            href="/sign-in/"
            className="truncate rounded-full px-1.5 py-2 no-underline hover:bg-primary-3 hover:text-primary-11 tablet:px-4"
          >
            ログイン
          </Link>
        </li>
        <li>
          <UserButton afterSignOutUrl="/" />
        </li>
      </ul>
    </nav>
    {children}
  </header>
);
