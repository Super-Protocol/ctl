import z from 'zod';
import { isAddress } from 'web3-validator';

const WalletAddress = z.custom<string>((val) => isAddress(val as string), 'Invalid wallet address');

export const ProviderInfoValidator = z.object({
  name: z.string(),
  description: z.string(),
  tokenReceiver: WalletAddress,
  actionAccount: WalletAddress,
  metadata: z.string(),
});
