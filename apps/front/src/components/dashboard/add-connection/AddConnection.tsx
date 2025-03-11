import { LucideLink, LucidePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { ConnectionSource } from "@/types/source";
import { ConnectionType, CONNECTION_SOURCES } from "@trck-fnds/shared";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import { Input } from "../../ui/input";
import {
  BankConnector,
  BinanceConnector,
  BitcoinWalletConnector,
  EthereumWalletConnector,
} from "./ConnectorButtons";

const COMPONENT_BY_CONNECTION_TYPE: {
  [key in ConnectionType]: ({
    connector,
    connectorButton,
  }: {
    connector: ConnectionSource;
    connectorButton: ReactNode;
  }) => JSX.Element;
} = {
  [ConnectionType.POWENS]: BankConnector,
  [ConnectionType.ETH_WALLET]: EthereumWalletConnector,
  [ConnectionType.BTC_WALLET]: BitcoinWalletConnector,
  [ConnectionType.BINANCE]: BinanceConnector,
};

export const AddConnection = () => {
  const [connectorSearch, setConnectorSearch] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <LucidePlus className="w-4 h-4" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-none">
        <DialogHeader>
          <DialogTitle className="mb-2">Add Connection</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 w-full">
              <Input
                placeholder="Search for a connector"
                value={connectorSearch}
                onChange={(e) => setConnectorSearch(e.target.value)}
              />
              <div className="flex flex-col gap-2 w-full overflow-y-auto h-64 rounded-md">
                {CONNECTION_SOURCES.filter((connector) =>
                  connector.name
                    .toLowerCase()
                    .includes(connectorSearch.toLowerCase())
                )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((connector) =>
                    React.createElement(
                      COMPONENT_BY_CONNECTION_TYPE[connector.connectionType],
                      {
                        key: connector.name,
                        connector,
                        connectorButton: <Connector connector={connector} />,
                      }
                    )
                  )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const Connector = ({ connector }: { connector: ConnectionSource }) => {
  return (
    <Button
      className="flex items-center justify-start gap-x-4 text-gray-50 h-12"
      variant="outline"
      asChild
    >
      <div>
        {connector.logo ? (
          <Image
            src={`/images/connections-logo/${connector.logo}`}
            alt={connector.name}
            width={0}
            height={0}
            sizes="100vw"
            className="w-7 h-7 p-1 object-contain rounded-full"
          />
        ) : (
          <LucideLink className="w-7 h-7" />
        )}
        {connector.name}
      </div>
    </Button>
  );
};

const PopularConnector = ({ connector }: { connector: ConnectionSource }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-between flex-col gap-1 p-2 w-[6.5rem] h-[6.5rem] text-xs"
          variant="outline"
        >
          <div className="h-full flex items-center justify-center">
            <Image
              className="w-auto h-10"
              src={`/images/connections-logo/${connector.logo}`}
              alt={connector.name}
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
          <span className="text-xs break-words">{connector.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {connector.name} connection</DialogTitle>
          <DialogDescription>{connector.name}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
