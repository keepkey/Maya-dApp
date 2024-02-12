"use client"
/*
    * KeepKey Wallet Integration Example

 */
import { useState, useEffect, use } from 'react';
import {
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Spinner,
    Text,
    VStack,
    Box,
    Button,
    Flex,
    Avatar,
    ChakraProvider,
    useColorMode,
    useDisclosure,
    AvatarBadge,
    useToast,
} from '@chakra-ui/react';
import { useKeepKeyWallet } from './contexts/WalletProvider';
import { theme } from './styles/theme';
import Header from './components/navBar';
import formatCacao from './utils/formatBalances';
import { useHandleTransfer } from './hooks/useTransfer';
import { Toast } from '@chakra-ui/react';
const ForceDarkMode = ({ children }: { children: React.ReactNode }) => {
    const { setColorMode } = useColorMode();

    useEffect(() => {
        setColorMode('dark');
    }, [setColorMode]);

    return <>{children}</>;
};


const Home = () => {
    const { connectWallet, disconnectWallet, keepkeyInstance } = useKeepKeyWallet();
    const isConnected = !!keepkeyInstance;
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalances, setWalletBalances] = useState('0');
    const [isPairing, setIsPairing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const avatarUrl = 'https://pioneers.dev/coins/mayachain.png';
    const [amountToSend, setAmountToSend] = useState("");
    const [destination, setDestination] = useState("");
    const [isSending, setIsSending] = useState(false);
    const toast = useToast();
    const handleTransfer = useHandleTransfer(keepkeyInstance);

    const onClickSend = async () => {
        try {
            setIsSending(true);
            if (!amountToSend || !destination) {
                toast({
                    title: "Error",
                    description: "Please enter a valid amount and destination",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setIsSending(false);
                return;
            }
            else (
                toast({
                    title: "Look at your Device",
                    description: "Confirm the transaction on your Keepkey",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            )
            const txHash = await handleTransfer("CACAO", parseFloat(amountToSend), destination);
            console.log("txHash: ", txHash);
            toast({
                title: "Success",
                description: String(txHash),
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            if (txHash) {
                setTimeout(() => {
                    window.open('https://www.mayascan.org/tx/' + String(txHash), '_blank', 'toolbar=0,location=0,menubar=0,width=600,height=400');
                }, 3000);
            }

            if (keepkeyInstance && keepkeyInstance['MAYA'])

                setWalletBalances(formatCacao(keepkeyInstance['MAYA'].wallet.balance[0].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[0].decimalMultiplier));

            setIsSending(false);
        } catch (error) {
            console.error("Error initiating transfer:", error);
            setIsSending(false);
        }
    };


    let loadWallet = async function () {
        try {
            console.log("keepkeyInstance: ", keepkeyInstance);
            if (keepkeyInstance && keepkeyInstance['MAYA']) {
                const walletMethods = keepkeyInstance['MAYA'].walletMethods;
                const address = await walletMethods.getAddress();
                setWalletAddress(address);
                console.log("address: ", address);
                const balance = formatCacao(keepkeyInstance['MAYA'].wallet.balance[0].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[0].decimalMultiplier);
                console.log("balance: ", balance);
                setWalletBalances(balance);
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        loadWallet();
    }, [keepkeyInstance]);

    return (
        <ChakraProvider theme={theme}>
            <ForceDarkMode>
                <Box minHeight="100vh" bg="gray.700">
                    <Header connectWallet={connectWallet} disconnectWallet={disconnectWallet} isConnected={isConnected} />
                    <Flex
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        flexGrow={1}
                    >
                        {!isSending ? (
                            <Box textAlign="center" mt={4}>
                                {isConnected ? (
                                    <div>
                                        <VStack align="start" borderRadius="md" p={6} spacing={5}>
                                            <Heading as="h1" mb={4} size="lg">
                                                Send Crypto!
                                            </Heading>
                                            {isPairing ? (
                                                <Box>
                                                    <Text mb={2}>
                                                        <Spinner size="xl" />
                                                        Please check your wallet to approve the connection.
                                                    </Text>
                                                </Box>
                                            ) : (
                                                <div>
                                                    <Flex align="center" direction={{ base: 'column', md: 'row' }} gap={20}>
                                                        <Box>
                                                            <Avatar size="xl" src={avatarUrl}>
                                                                <AvatarBadge boxSize='1.25em'>
                                                                    <Avatar border={"1px solid white"} src={'/keepkey.png'} />
                                                                </AvatarBadge>
                                                            </Avatar>
                                                        </Box>
                                                        <Box>
                                                            {/* Additional content can be added here if needed */}
                                                        </Box>
                                                    </Flex>
                                                    <br />
                                                    <Grid
                                                        gap={10}
                                                        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                                                        w="full"
                                                    >
                                                        <FormControl>
                                                            <FormLabel>Recipient:</FormLabel>
                                                            <Input
                                                                onChange={(e) => setDestination(e.target.value)}
                                                                placeholder="Address"
                                                                value={destination}
                                                            />
                                                        </FormControl>
                                                        <FormControl>
                                                            <FormLabel>Input Amount:</FormLabel>
                                                            <Input
                                                                onChange={(e) => setAmountToSend(e.target.value)}
                                                                placeholder="0.0"
                                                                value={amountToSend}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <br />
                                                    <Text>
                                                        Connected Address: {walletAddress}
                                                    </Text>
                                                    <br />
                                                    <Text>
                                                        Available Balance: {walletBalances} CACAO
                                                    </Text>
                                                </div>
                                            )}
                                            <Button
                                                colorScheme="green"
                                                w="full"
                                                mt={4}
                                                isLoading={isSubmitting}
                                                onClick={() => onClickSend()}
                                            >
                                                {isSubmitting ? <Spinner size="xs" /> : 'Send'}
                                            </Button>
                                        </VStack>
                                    </div>
                                ) : (
                                    <Button colorScheme="teal" onClick={connectWallet}>
                                        Connect Wallet
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Box textAlign="center" mt={4}>
                                <Spinner size="xl" />
                            </Box>
                        )}


                    </Flex>
                </Box>
            </ForceDarkMode>
        </ChakraProvider>
    );
};

export default Home;
