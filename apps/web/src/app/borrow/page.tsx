import { BorrowPage } from '@/components/BorrowPage/BorrowPage';
export const revalidate = 10;

const Home = async () => {
  return <BorrowPage />;
};

export default Home;
