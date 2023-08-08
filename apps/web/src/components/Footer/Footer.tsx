import type { ComponentPropsWithoutRef, FC } from 'react';
// import { RxGithubLogo, RxInstagramLogo, RxNotionLogo, RxTwitterLogo } from 'react-icons/rx';
import { RxGithubLogo } from 'react-icons/rx';
import { Image } from '@/components/Image/Image';
import { Link } from '@/components/Link/Link';
import NiticLogoImage from '@public/logo/nitic.png';
import DarkLogoImage from '@public/logo/slogan-dark.png';
import LightLogoImage from '@public/logo/slogan-light.png';

type FooterProps = ComponentPropsWithoutRef<'footer'>;

export const Footer: FC<FooterProps> = (props) => (
  <footer className="flex justify-center bg-dot-pattern-light p-6 shadow-floating dark:bg-dot-pattern-dark" {...props}>
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 border-b-2 border-keyplate-6 pb-2 tablet:flex-row tablet:gap-6">
        <div className="flex max-w-sm flex-col gap-4 border-b-2 border-keyplate-6 pb-2 tablet:border-b-0 tablet:border-r-2 tablet:pr-6">
          <Link external href={new URL('https://www.ibaraki-ct.ac.jp/').href} target="_blank" rel="noopener noreferrer">
            <Image
              src={NiticLogoImage}
              sizes={{
                tablet: '40vw',
                default: '100vw',
              }}
              placeholder="blur"
              alt="茨城工業高等専門学校のロゴ"
              className="w-full select-none"
            />
          </Link>
          <Link href="/" className="mx-6">
            <Image
              src={LightLogoImage}
              alt="Shelfreeのロゴ"
              sizes={{
                default: '40vw',
                tablet: '25vw',
                desktop: '20vw',
              }}
              placeholder="blur"
              className="w-full dark:hidden"
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
              className="hidden w-full dark:block"
            />
          </Link>
        </div>
        <ul className="flex flex-col gap-3 py-3 font-bold text-keyplate-11">
          {/* <li className="flex items-center gap-1">
            <RxTwitterLogo />
            Twitter
            <Link external href={new URL('https://twitter.com/acme/').href} target="_blank" rel="noopener noreferrer">
              @acme
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <RxInstagramLogo />
            Instagram
            <Link
              external
              href={new URL('https://www.instagram.com/acme/').href}
              target="_blank"
              rel="noopener noreferrer"
            >
              @acme
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <RxNotionLogo />
            Notionで
            <Link external href={new URL('https://notion.so/').href} target="_blank" rel="noopener noreferrer">
              @acmeの概要を知る
            </Link>
          </li> */}
          <li className="flex items-center gap-1">
            <RxGithubLogo />
            GitHubで
            <Link
              external
              href={new URL('https://github.com/nitic-pbl-p4').href}
              target="_blank"
              rel="noopener noreferrer"
            >
              PBL実験4班の取り組みを見る
            </Link>
          </li>
        </ul>
      </div>
      <address className="py-4 text-xs font-bold not-italic text-keyplate-11">
        <p>〒312-8508 茨城県ひたちなか市中根866</p>
        <p>Tel. 029-272-5201</p>
      </address>
      <small className="w-fit rounded-full bg-keyplate-3 px-2 py-1 text-xs text-keyplate-11">
        Copyright © 2023 NITIC 4E/I PBL Team 4
      </small>
    </div>
  </footer>
);
