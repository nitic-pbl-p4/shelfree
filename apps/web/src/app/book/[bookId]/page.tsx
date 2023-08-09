import type { ReactElement } from 'react';

import { Image } from '@/components/Image/Image';

const knownBooks: Record<
  string,
  {
    name: string;
    image?: string;
  }
> = {
  '7663cf25': {
    name: '最果タヒ (新潮文庫)',
    image: '/book/saihatetahi.jpeg',
  },
  '123456ab': {
    name: 'ハリー・ポッターと賢者の石',
  },
};

type BookDetailPageParams = {
  bookId: string;
};

export const generateStaticParams = async (): Promise<BookDetailPageParams[]> => {
  return Object.entries(knownBooks).map(([bookId]) => ({ bookId }));
};

const BookDetailPage = async ({ params }: { params: BookDetailPageParams }): Promise<ReactElement> => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-keyplate-12">
      <article className="flex max-w-2xl flex-col gap-4 p-6">
        <h1 className="my-6 text-center text-5xl font-bold leading-normal text-keyplate-12">
          📚 {knownBooks[params.bookId] && knownBooks[params.bookId].name}
        </h1>
        <section>
          <p>本のRFIDタグの識別番号: {params.bookId}</p>
          {knownBooks[params.bookId] && knownBooks[params.bookId].image && (
            <Image
              src={knownBooks[params.bookId].image as string}
              className="relative w-full object-cover"
              width={400}
              height={600}
              alt="本の表紙"
            />
          )}
          <p>
            そこでは、あらゆる事が可能である。人は一瞬にして氷雲の上に飛躍し大循環の風を従へて北に旅する事もあれば、赤い花杯の下を行く蟻と語ることもできる。
            罪や、かなしみでさへそこでは聖くきれいにかゞやいてゐる。
          </p>
        </section>
      </article>
    </div>
  );
};

export default BookDetailPage;

export const revalidate = 60;

// export const generateMetadata = async ({ params }: { params: ArticlePageParams }): Promise<Metadata> => {

//   const metadata: Metadata = {
//   };

//   return metadata;
// };
