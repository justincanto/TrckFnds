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
import {
  ConnectionType,
  BinanceSourceDetails,
  EthSourceDetails,
  IEthereumToken,
} from "@trckfnds/shared";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";

export const AssetsAccordion = ({
  assets,
}: {
  assets: Asset[] | undefined;
}) => {
  return (
    <Card>
      <CardContent className="py-2">
        <Accordion type="multiple" className="w-full">
          {assets?.map((asset, i) => (
            <AccordionItem
              key={asset.category}
              value={asset.category}
              className={`${i === assets.length - 1 ? "border-none" : ""}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full justify-between mr-4 font-bold text-lg">
                  <p>{ASSET_CATEGORY_LABEL[asset.category]}</p>
                  <div>{formatCurrency(asset.balance)}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {asset.accounts.map((account, i) => {
                  return (
                    <>
                      {[
                        ConnectionType.ETH_WALLET,
                        ConnectionType.BINANCE,
                      ].includes(account.connectionType) ? (
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          key={account.name}
                        >
                          <AccordionItem
                            value={account.name}
                            className="border-none"
                          >
                            <AccordionTrigger className="hover:no-underline py-1.5">
                              <div
                                key={account.name}
                                className="flex justify-between mr-4 py-3 w-full"
                              >
                                <div className="flex items-center gap-x-2">
                                  <Image
                                    src={`/images/connections-logo/${account.logo}`}
                                    alt={account.id}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <p>{account.name}</p>
                                </div>
                                <p>{formatCurrency(account.usdValue)}</p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8">
                              {(
                                account as
                                  | EthSourceDetails
                                  | BinanceSourceDetails
                              ).tokens.map((token) => {
                                const blockchain =
                                  account.connectionType ===
                                  ConnectionType.ETH_WALLET
                                    ? ` (${
                                        (token as IEthereumToken).blockchain
                                      })`
                                    : "";
                                return (
                                  <div
                                    key={token.name + blockchain}
                                    className="flex justify-between mr-8 py-1.5 items-center"
                                  >
                                    <p>
                                      {(token as IEthereumToken).name}
                                      {blockchain}
                                    </p>
                                    <p>{formatCurrency(token.usdValue)}</p>
                                  </div>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <div
                          key={account.name}
                          className="flex justify-between mr-8 py-[18px]"
                        >
                          <div className="flex items-center gap-x-2">
                            <Image
                              src={`/images/connections-logo/${account.logo}`}
                              alt={account.id}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <p>{account.name}</p>
                          </div>
                          <p>{formatCurrency(account.usdValue)}</p>
                        </div>
                      )}
                      {i !== asset.accounts.length - 1 && <Separator />}
                    </>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
