import type { FC } from 'react';
import HeroImage from './opengraph-image.png';
import { Image } from '@/components/Image/Image';

const Home: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-keyplate-12">
      <article className="flex max-w-2xl flex-col gap-4 p-6">
        <Image
          src={HeroImage}
          priority
          placeholder="blur"
          className="relative w-full object-cover"
          alt="SHELFREEの紹介画像"
        />
        <h1 className="my-6 text-center text-5xl font-bold leading-normal text-keyplate-12">
          <span className="text-2xl">顔認証とRFIDタグを使った</span>
          <br />
          無人図書貸し出しシステム
        </h1>
        <section>
          <p>
            SHELFREEは、その「📚 必要なのはあなたの顔と貸りたい本だけ！本で繋がる友情
            👫」から推測できる通り、以下の主要な機能を提供します：
          </p>
          <ul className="my-4 ml-8 list-disc">
            <li>あなたのおすすめの本の貸出管理を任せて、みんなに読んでもらえるように共有できる</li>
            <li>事前登録された顔画像をもとに、借りようとしている個人を識別できる</li>
            <li>借りたい本をリーダーに近づけるだけで、片手で借りる本を指定できる</li>
            <li>
              貸し出し中の本のみを受け付ける返却ボックスに投函するだけで、管理者にLINEで通知を送り本の返却を行える
            </li>
            <li>Webアプリケーションから、現地にいなくても本の貸し出し状況と返却期限を確認できる</li>
          </ul>
          <p>
            これにより、学校の部活・同好会や研究室などの図書貸し出し管理に人的リソースを割けない環境においても、管理者と使用者ともに使い心地のいい体験を提供することが可能になリます。
            なにより、みんなにあなたのおすすめの本を実際に読んでもらう機会が格段に得やすくなります。本を介してコミュニケーションを始めましょう！
          </p>
          <hr className="my-4 h-px w-full bg-keyplate-4" />
          <p>
            技術的な詳細については、RFIDタグ Mifare Classic
            1Kを本の背表紙の裏に貼り付け、それを貸し出し処理時に5cm程度の非接触通信を行えるRFIDリーダ
            MFRC522で読み取ることで、片手でできて使いやすく信頼性のある本の指定を実現しています。
            また、顔認証処理については、Webカメラから読み取った借りる人の顔をリアルタイムに読み取って推論しています。そして、Python3のライブラリface_recognitionを用いて事前登録された顔画像をもとに顔の特徴が十分近い人物を求めて、貸し出し登録に使用しています。
          </p>
        </section>
      </article>
    </div>
  );
};

export default Home;
