"use client"
/*
    * KeepKey Wallet Integration Example

 */
import { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    Grid,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Heading,
    Input,
    Spinner,
    Text,
    VStack,
    Box,
    Select,
    Button,
    Flex,
    Avatar,
    Alert,
    AlertIcon,
    ChakraProvider,
    useColorMode,
    useDisclosure,
    Switch,
    AvatarBadge,
    useToast,
    Badge,
    HStack,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useKeepKeyWallet } from './contexts/WalletProvider';
import { theme } from './styles/theme';
import Header from './components/navBar';
import { formatCacao, formatMaya } from './utils/formatBalances';
import { useHandleTransfer } from './hooks/useTransfer';
import { useHandleDeposit } from './hooks/useDeposit';
import { Toast } from '@chakra-ui/react';
import { useCacaoPrice } from './contexts/CacaoPriceContext';
import { useMayaPrice } from './contexts/MayaPriceContext';
import { FaCopy } from 'react-icons/fa';
import Confetti from 'react-confetti';

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
    const [memo, setMemo] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('CACAO');
    const [cacaoUSD, setCacaoUSD] = useState(0);
    const [mayaBalanceUSD, setMayaBalanceUsd] = useState(0);
    const toast = useToast();
    const handleTransfer = useHandleTransfer(keepkeyInstance);
    const handleDeposit = useHandleTransfer(keepkeyInstance);
    const cacaoPrice = useCacaoPrice();
    const mayaPrice = useMayaPrice();
    const [showConfetti, setShowConfetti] = useState(false);
    const [useDeposit, setUseDeposit] = useState(false); // State to handle toggle

    const onClickSend = async (selectedCurrency: any) => {
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
            const txHash = await handleTransfer(selectedCurrency, parseFloat(amountToSend), destination, memo);
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


            // Trigger confetti
            setShowConfetti(true);

            // Optional: Hide confetti after a few seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000); // Adjust time as needed
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

                const balanceIndex = selectedCurrency === 'CACAO' ? 0 : 1;
                const balance = selectedCurrency === 'CACAO' ? formatCacao(wallet.balance[balanceIndex].bigIntValue, wallet.balance[balanceIndex].decimalMultiplier) : formatMaya(wallet.balance[balanceIndex].bigIntValue, wallet.balance[balanceIndex].decimalMultiplier);
                setWalletBalances(balance);

                const priceValue = selectedCurrency === 'CACAO' ? cacaoPrice : mayaPrice;
                const usdValue = Number(balance) * (priceValue || 0);
                selectedCurrency === 'CACAO' ? setCacaoUSD(usdValue) : setMayaBalanceUsd(usdValue);
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        loadWallet();
    }, [keepkeyInstance]);

    const updateBalance = async () => {
        try {
            if (keepkeyInstance?.['MAYA']) {
                const balanceIndex = selectedCurrency === 'CACAO' ? 0 : 1;
                const balance = keepkeyInstance['MAYA'].wallet.balance[balanceIndex] ? formatCacao(keepkeyInstance['MAYA'].wallet.balance[balanceIndex].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[balanceIndex].decimalMultiplier) : '0';
                setWalletBalances(balance);

                const priceValue = selectedCurrency === 'CACAO' ? cacaoPrice : mayaPrice;
                const usdValue = Number(balance) * (priceValue || 0);
                selectedCurrency === 'CACAO' ? setCacaoUSD(usdValue) : setMayaBalanceUsd(usdValue);
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        updateBalance();
    }, [selectedCurrency]);


    const handleMaxClick = () => {
        // Logic to set the max amount
        setAmountToSend((Number(walletBalances) - 1).toString());
    };

    const setCurrencyAndLoadBalance = async (currency: any) => {
        setSelectedCurrency(currency);
    };

    return (
        <ChakraProvider theme={theme}>
            {showConfetti && <Confetti />}

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
                                                        <TableContainer>
                                                            <Table colorScheme='teal'>

                                                                <Tbody>
                                                                    <Tr>
                                                                        <Td>Connected Address</Td>
                                                                        <Td>
                                                                            <HStack onClick={() => {
                                                                                navigator.clipboard.writeText(walletAddress);
                                                                                toast({
                                                                                    title: "Copied",
                                                                                    description: "Address copied to clipboard",
                                                                                    status: "success",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                });
                                                                            }}>
                                                                                <Text>
                                                                                    {walletAddress}
                                                                                </Text>
                                                                                <FaCopy style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                                                                            </HStack>
                                                                        </Td>
                                                                    </Tr>
                                                                    <Tr>
                                                                        <Td>Available Balance</Td>
                                                                        <Td>
                                                                            <Menu>
                                                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                                                    {walletBalances} {selectedCurrency} {selectedCurrency === 'MAYA' && <Text fontSize={"12px"}> (~{mayaBalanceUSD.toFixed(3)}) USD</Text>}
                                                                                    {selectedCurrency === 'CACAO' && <Text fontSize={"12px"}> (~{cacaoUSD.toFixed(3)}) USD</Text>}
                                                                                </MenuButton>
                                                                                <MenuList>
                                                                                    <MenuItem onClick={() => setCurrencyAndLoadBalance('CACAO')}>CACAO</MenuItem>
                                                                                    <MenuItem onClick={() => setCurrencyAndLoadBalance('MAYA')}>MAYA</MenuItem>
                                                                                </MenuList>
                                                                            </Menu>
                                                                        </Td>
                                                                    </Tr>
                                                                </Tbody>
                                                            </Table>
                                                        </TableContainer>
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
                                                            <HStack>
                                                                <FormLabel>Input Amount:</FormLabel>
                                                                <Badge marginBottom={2} colorScheme="green" onClick={handleMaxClick} style={{ cursor: 'pointer' }}>Max</Badge>
                                                            </HStack>
                                                            <Input
                                                                onChange={(e) => setAmountToSend(e.target.value)}
                                                                placeholder="0.0"
                                                                value={amountToSend}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <br />
                                                    <Grid
                                                        gap={10}
                                                    >
                                                        <FormControl>
                                                            <FormLabel>Memo: (optional)</FormLabel>
                                                            <Input
                                                                onChange={(e) => setMemo(e.target.value)}
                                                                placeholder="Memo"
                                                                value={memo}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </div>
                                            )}
                                            <FormControl display="flex" alignItems="center">
                                                <FormLabel htmlFor="use-deposit" mb="0">
                                                    Advanced: Use Deposit
                                                </FormLabel>
                                                <Switch id="use-deposit" isChecked={useDeposit} onChange={() => setUseDeposit(!useDeposit)} />
                                            </FormControl>
                                            {useDeposit && (
                                                <Alert status="warning" variant="solid" mb={4}>
                                                    <AlertIcon />
                                                    This method is for advanced users and specific to MayaChain actions. this method is NOT to send funds it is for deposits into vaults.
                                                </Alert>
                                            )}
                                            <Button
                                                bg="#131c3d"
                                                _hover={{ bg: '#1a2249' }}
                                                border={"1px solid teal"}
                                                w="full"
                                                mt={4}
                                                isLoading={isSubmitting}
                                                onClick={() => onClickSend(selectedCurrency)}
                                            >
                                                {isSubmitting ? <Spinner size="xs" /> : (useDeposit ? 'Deposit' : 'Send')}
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
