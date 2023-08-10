import type { Meta, StoryObj } from '@storybook/react';
import { BookItem } from './BookItem';

type Story = StoryObj<typeof BookItem>;

const meta: Meta<typeof BookItem> = {
  component: BookItem,
  argTypes: {
    title: {
      description: '本のタイトル',
      control: {
        type: 'text',
      },
    },
    image: {
      description: '本の表紙の画像のURL',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    className: 'w-96',
    title: '空が分裂する',
    image: 'https://vywtcnquhodflpipwjem.supabase.co/storage/v1/object/public/shelfree/7663cf25.jpeg',
    author: '最果 タヒ （著）',
    createdAt: new Date('2023-08-09T14:09:46.856Z'),
    availableDays: 14,
  },
};

export const NoImage: Story = {
  args: {
    className: 'w-96',
    title: '空が分裂する',
    author: '最果 タヒ （著）',
    createdAt: new Date('2023-08-09T14:09:46.856Z'),
    availableDays: 14,
  },
};
