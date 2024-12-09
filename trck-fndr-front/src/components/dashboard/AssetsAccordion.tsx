import { Asset } from "@/types/portfolio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { formatCurrency } from "@/utils/format";
import { ASSET_CATEGORY_LABEL } from "@/constants/portfolio";
import Image from "next/image";

export const AssetsAccordion = ({
  assets,
}: {
  assets: Asset[] | undefined;
}) => {
  return (
    <Accordion type="multiple" className="w-full">
      {assets?.map((asset) => (
        <AccordionItem key={asset.category} value={asset.category}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex w-full justify-between mr-4 font-bold text-lg">
              <p>{ASSET_CATEGORY_LABEL[asset.category]}</p>
              <div>{formatCurrency(asset.balance)}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {asset.accounts.map((account) => (
              <div
                key={account.name}
                className="flex justify-between mr-8 py-3"
              >
                <div className="flex items-center gap-x-2">
                  <Image
                    src={`/images/connections-logo/${account.logo}`}
                    alt={account.logo}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p>{account.name}</p>
                </div>
                <p>{formatCurrency(account.usdValue)}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
