'use client';

import { useRouter } from 'next/navigation';
import { useDrawerContext } from '@/context/DrawerContext';

export function useNavigation() {
  const router = useRouter();
  const { closeDrawer } = useDrawerContext();

  const navigate = (path: string) => {
    closeDrawer();
    router.push(path);
  };

  return { navigate };
} 