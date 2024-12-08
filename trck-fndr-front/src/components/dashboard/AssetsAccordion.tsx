import { Asset } from "@/types/portfolio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { formatCurrency } from "@/utils/format";

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
            <div className="flex w-full justify-between mr-4 font-bold">
              <div>{asset.category}</div>
              <div>{formatCurrency(asset.balance)}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {asset.accounts.map((account) => (
              <div
                key={account.name}
                className="flex justify-between mr-8 py-1.5"
              >
                <p>{account.name}</p>
                <p>{formatCurrency(account.usdValue)}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
