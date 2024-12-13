import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { ConnectionSource } from "@/types/source";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { EthereumBlockchain, EthereumToken } from "@/types/crypto";

export const BankConnector = ({
  connector,
  connectorButton,
}: {
  connector: ConnectionSource;
  connectorButton: ReactNode;
}) => {
  return (
    <button
      onClick={async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/bank/connection-url`,
          { params: { connectorId: connector.id }, withCredentials: true }
        );
        window.location.href = data.connectionUrl;
      }}
    >
      {connectorButton}
    </button>
  );
};

const ETHEREUM_BLOCKCHAINS: Option[] = [
  { label: "Ethereum", value: EthereumBlockchain.ETHEREUM },
  { label: "Polygon", value: EthereumBlockchain.POLYGON },
  { label: "Arbitrum", value: EthereumBlockchain.ARBITRUM },
  { label: "Optimism", value: EthereumBlockchain.OPTIMISM },
];

const ETHEREUM_TOKENS = [
  { label: "ETH", value: EthereumToken.ETH, fixed: true },
  { label: "USDC", value: EthereumToken.USDC },
  { label: "USDT", value: EthereumToken.USDT },
  { label: "DAI", value: EthereumToken.DAI },
  { label: "POL", value: EthereumToken.POL },
  { label: "AAVE", value: EthereumToken.AAVE },
  { label: "LINK", value: EthereumToken.LINK },
  { label: "GRT", value: EthereumToken.GRT },
  { label: "FETCH", value: EthereumToken.FET },
  { label: "RENDER", value: EthereumToken.RENDER },
];

const ethereumWalletConnectionFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" }),
  address: z
    .string()
    .length(42, { message: "Invalid ethereum address" })
    .startsWith("0x", { message: "Invalid ethereum address" }),
  blockchains: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1, { message: "At least one blockchain must be selected" }),
  // tokens: z
  //   .array(
  //     z.object({
  //       label: z.string(),
  //       value: z.string(),
  //       fixed: z.boolean(),
  //     })
  //   )
  //   .min(1, { message: "At least one token must be selected" }),
});

export const EthereumWalletConnector = ({
  connector,
  connectorButton,
}: {
  connector: ConnectionSource;
  connectorButton: ReactNode;
}) => {
  const form = useForm<z.infer<typeof ethereumWalletConnectionFormSchema>>({
    resolver: zodResolver(ethereumWalletConnectionFormSchema),
    defaultValues: {
      name: "",
      address: "",
      blockchains: [{ label: "Ethereum", value: EthereumBlockchain.ETHEREUM }],
      // tokens: [{ label: "ETH", value: EthereumToken.ETH, fixed: true }],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof ethereumWalletConnectionFormSchema>
  ) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/connect/ethereum-wallet`,
      {
        ...data,
        blockchains: data.blockchains.map((b) => b.value),
        // tokens: data.tokens.map((t) => t.value),
      },
      { withCredentials: true }
    );
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger>{connectorButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Ethereum Wallet</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Ledger" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockchains"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Blockchains</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          defaultOptions={ETHEREUM_BLOCKCHAINS}
                          placeholder="Select blockchains where this wallet is used"
                          badgeClassName="rounded-full"
                          value={value ? value : []}
                          onChange={onChange}
                          commandListClassName="max-h-[10rem]"
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="tokens"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Tokens</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          defaultOptions={ETHEREUM_TOKENS}
                          placeholder="Select Tokens you want to track"
                          badgeClassName="rounded-full"
                          value={value ? value : []}
                          onChange={onChange}
                          commandListClassName="max-h-[10rem]"
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              no results found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        ETH balance will always be fetched.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const bitcoinWalletConnectionFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" }),
  addresses: z
    .string()
    .transform((str) => str.split(",").map((s) => s.trim()))
    .refine(
      (arr) => arr.every((addr) => addr.length >= 26 && addr.length <= 65),
      {
        message:
          "Each Bitcoin address must be between 26 and 65 characters long",
      }
    ),
});

export const BitcoinWalletConnector = ({
  connector,
  connectorButton,
}: {
  connector: ConnectionSource;
  connectorButton: ReactNode;
}) => {
  const form = useForm<z.infer<typeof bitcoinWalletConnectionFormSchema>>({
    resolver: zodResolver(bitcoinWalletConnectionFormSchema),
    defaultValues: {
      name: "",
      addresses: [],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof bitcoinWalletConnectionFormSchema>
  ) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/connect/bitcoin-wallet`,
      data,
      { withCredentials: true }
    );
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger>{connectorButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Bitcoin Wallet</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Ledger" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="bc1..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a list of coma separated bitcoin addresses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const binanceConnectionFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" }),
  apiKey: z.string().nonempty({ message: "API Key is required" }),
  secretKey: z.string().nonempty({ message: "Secret Key is required" }),
});

export const BinanceConnector = ({
  connector,
  connectorButton,
}: {
  connector: ConnectionSource;
  connectorButton: ReactNode;
}) => {
  const form = useForm<z.infer<typeof binanceConnectionFormSchema>>({
    resolver: zodResolver(binanceConnectionFormSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      secretKey: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof binanceConnectionFormSchema>
  ) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/connect/binance`,
      data,
      { withCredentials: true }
    );
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger>{connectorButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Binance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="API Key" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        This is the api key for your Binance account.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Secret Key" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the secret key for your Binance account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
