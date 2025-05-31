import { create } from 'zustand';

import { IMerchant } from '@/interface/merchant-interface';

interface MerchantState {
  merchants: IMerchant[] | null;
}
interface MerchantStore extends MerchantState {
  setMerchants: (merchants: IMerchant[]) => void;
}

export const useMerchant = create<MerchantStore>()((set) => ({
  merchants: null,
  setMerchants: (merchants: IMerchant[]) => set({ merchants }),
}));
