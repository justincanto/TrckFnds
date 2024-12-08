import { AssetCategory } from "../portfolio/types";
import { PowensAccountType } from "./types";

export const ASSET_TYPE_BY_POWENS_ACCOUNT_TYPE: {
  [key in PowensAccountType]: AssetCategory;
} = {
  [PowensAccountType.ARTICLE_83]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.CAPITALISATION]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.CARD]: AssetCategory.BANK_ACCOUNT,
  [PowensAccountType.CHECKING]: AssetCategory.BANK_ACCOUNT,
  [PowensAccountType.CROWDLENDING]: AssetCategory.STOCKS,
  [PowensAccountType.DEPOSIT]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.JOINT]: AssetCategory.BANK_ACCOUNT, // Deprecated, but assign BANK_ACCOUNT as a default
  [PowensAccountType.LDDS]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.LIFE_INSURANCE]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.LOAN]: AssetCategory.BANK_ACCOUNT, // Assuming loans fall under BANK_ACCOUNT
  [PowensAccountType.MADELIN]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.MARKET]: AssetCategory.STOCKS,
  [PowensAccountType.PEA]: AssetCategory.STOCKS,
  [PowensAccountType.PEE]: AssetCategory.STOCKS,
  [PowensAccountType.PER]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.PERCO]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.PERP]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.REAL_ESTATE]: AssetCategory.REAL_ESTATE,
  [PowensAccountType.RSP]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.SAVINGS]: AssetCategory.BANK_PASSBOOK,
  [PowensAccountType.UNKNOWN]: AssetCategory.BANK_ACCOUNT, // Default to BANK_ACCOUNT for unknown types
};
