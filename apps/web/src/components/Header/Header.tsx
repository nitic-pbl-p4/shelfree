import type { ComponentPropsWithoutRef, FC } from 'react';
import { NavLinks } from './NavLinks';
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
        'text-info- flex flex-col items-center justify-center gap-1 self-stretch bg-info-9 px-6 py-3 text-center font-bold'
      }
    >
      📚 必要なのはあなたの顔と貸りたい本だけ！本で繋がる友情 👫
    </nav>
    <nav
      aria-label="グローバルナビゲーション"
      className="flex w-full max-w-lg flex-row flex-nowrap items-stretch justify-center gap-6 px-6 py-3"
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
      <NavLinks />
    </nav>
    {children}
  </header>
);
