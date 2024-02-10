"use client";
import { Box, Text, HStack, VStack, Center, Button, Flex, Input } from "@chakra-ui/react";
import Image from "next/image";
import styles from "./page.module.css";
import Wallet from "./wallet";
import { useState } from "react";
import { formatCacao } from "@/utils/formatBigInt";
import { useHandleTransfer } from './hooks/useHandleTransfer'; // Adjust the path as needed
import { FaCopy, FaLock } from 'react-icons/fa';
import { useToast } from "@chakra-ui/react";
// import chakra provider 
import { ChakraProvider } from "@chakra-ui/react";

// Define interface for a single balance item
interface BalanceItem {
    address: string;
    bigIntValue: bigint;
    chain: string;
    decimal: number;
    decimalMultiplier: bigint;
    isGasAsset: boolean;
    isSynthetic: boolean;
    symbol: string;
    tax?: any;
    ticker: string;
    type: string;
}

// Define interface for the wallet details
interface WalletDetails {
    address: string;
    balance: BalanceItem[];
    walletType: string;
}

// Define interface for wallet methods with function signatures
interface WalletMethods {
    approve: Function;
    approvedAmount: Function;
    broadcastTransaction: Function;
    call: Function;
    createContract: Function;
    transfer: (payload: any) => Promise<string>;
    // Add the rest of the methods as needed with specific signatures if known
}

// Define interface for each currency wallet data (BTC, ETH, MAYA, etc.)
interface CurrencyWalletData {
    walletMethods: WalletMethods;
    wallet: WalletDetails;
}

// Define the main WalletData interface to capture all possible keys dynamically
interface WalletData {
    [key: string]: CurrencyWalletData;
}

export default function Home() {
    const [keepKey, setKeepKey] = useState<WalletData | null>(null);
    const [isSendFormVisible, setIsSendFormVisible] = useState(false);
    const [amountToSend, setAmountToSend] = useState("");
    const [destination, setDestination] = useState("");
    const [selectedBalance, setSelectedBalance] = useState<BalanceItem | null>(null);
    const handleTransfer = useHandleTransfer(keepKey);
    const toast = useToast();

    if (!keepKey) {
        return (
            <Center h="100vh">
                <Wallet keepkey={keepKey} setKeepKey={setKeepKey} />
            </Center>
        );
    }

    const onClickSend = async () => {
        try {
            toast({
                title: "Look at your KeepKey to confirm the transaction",
                description: "Confirm transaction",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-left", // Change this to any valid position
                variant: "subtle", // Change this to any valid variant
            });
            const txHash = await handleTransfer("CACAO", parseFloat(amountToSend), destination);
            // make a toast with a copyable txHash
            console.log("Transaction sent:", txHash);
            setIsSendFormVisible(false); // Close the send form upon successful send
            toast({
                title: "Transaction hash:",
                description: ` ${txHash}`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-left", // Change this to any valid position
                variant: "subtle", // Change this to any valid variant
            });
        } catch (error) {
            console.error("Error initiating transfer:", error);
        }
    };


    // create a handle Copy function that copy the value to the clipboard
    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value);
        toast({
            title: "Address copied",
            description: "The wallet address has been copied to your clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-left", // Change this to any valid position
            variant: "subtle", // Change this to any valid variant
        });
    }

    // Test Wallet : maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k


    return (
        <ChakraProvider >
            <>
                <main className={styles.main}>
                    <div className={styles.description}>
                        <VStack spacing={4} align="stretch" justify="center" width="100%" >
                            <center>
                                <Image
                                    src={"/maya.jpg"}
                                    alt="Maya Logo"
                                    width={200}
                                    height={200}
                                    style={{
                                        borderRadius: "50%",

                                    }}
                                />
                            </center>
                            {Object.entries(keepKey).map(([currency, data]) => (
                                <Box key={currency} p={5} shadow="md" borderWidth="1px" borderRadius="lg" >
                                    <center>
                                        <Text fontSize="2xl" fontWeight="bold" mb={3}>{currency}</Text>
                                    </center>
                                    <HStack>
                                        <Text fontSize="md">
                                            Address: {data.wallet.address}
                                        </Text>
                                        <FaCopy onClick={() => handleCopy(data.wallet.address)} />
                                    </HStack>
                                    {
                                        data.wallet.balance.map((balance, index) => (
                                            <Flex key={index} justify="space-between">
                                                <Text fontSize="md" mt={1}>
                                                    Balance: {formatCacao(balance.bigIntValue, balance.decimalMultiplier)} {balance.symbol}
                                                </Text>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedBalance(balance);
                                                        setIsSendFormVisible(true);
                                                    }}
                                                    borderRadius={5}
                                                    p={2}
                                                    backgroundColor={"black"}
                                                    color={"white"}
                                                >
                                                    SEND {balance.symbol}
                                                </Button>
                                            </Flex>
                                        ))
                                    }
                                </Box>
                            ))}

                            {isSendFormVisible && (


                                <center>

                                    <Box m={"10"} borderRadius="10px" mt={4} maxW={"80%"} border="2px solid black" >
                                        <Flex justifyContent="center" alignItems="center" p={4} border="1px solid black"  >
                                            <Box flex="1"></Box>
                                            <Button color={"white"} bg={"red"} onClick={() => setIsSendFormVisible(false)}>
                                                X
                                            </Button>
                                        </Flex>
                                        <Flex p={4} flexDirection={"column"}>
                                            <Text fontSize="xl" fontWeight="bold" mb={3}>
                                                Send {selectedBalance?.symbol}
                                            </Text>
                                            <Flex justifyContent={"left"}>

                                                <Button
                                                    maxW={"30%"}
                                                    m={2}
                                                    borderRadius="5px"
                                                    background={"black"}
                                                    color={"white"}
                                                >


                                                    Max
                                                </Button>
                                            </Flex>

                                            <Input
                                                placeholder={"Amount to Send"}
                                                value={amountToSend}
                                                onChange={(e: any) => setAmountToSend(e.target.value)}
                                                mb={3}
                                                borderRadius={5}
                                                marginLeft={2}
                                            />
                                            <Input
                                                placeholder="maya...fxfqkl5k"
                                                value={destination}
                                                onChange={(e: any) => setDestination(e.target.value)}
                                                borderRadius={5}
                                                marginLeft={2}

                                            />
                                            <Flex justifyContent={"right"}>

                                                <Button
                                                    onClick={onClickSend}
                                                    backgroundColor={"limegreen"}
                                                    borderRadius={5}
                                                    minW={"100px"}
                                                    minH={"40px"}
                                                    m={2}
                                                    leftIcon={<FaLock />}


                                                >
                                                    Send
                                                </Button>
                                            </Flex>

                                        </Flex>
                                    </Box>

                                </center>

                            )}
                        </VStack>
                    </div>
                </main >
            </>
        </ChakraProvider>
    );
}
