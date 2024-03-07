"use client"
/*
    * KeepKey Wallet Integration Example

 */
import { useState, useEffect, use } from 'react';
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
    ChakraProvider,
    useColorMode,
    useDisclosure,
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
import formatCacao from './utils/formatBalances';
import { useHandleTransfer } from './hooks/useTransfer';
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
    const toast = useToast();
    const handleTransfer = useHandleTransfer(keepkeyInstance);
    const cacaoPrice = useCacaoPrice();
    const mayaPrice = useMayaPrice();
    const [showConfetti, setShowConfetti] = useState(false);

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
            const txHash = await handleTransfer("CACAO", parseFloat(amountToSend), destination, memo);
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

            if (keepkeyInstance && keepkeyInstance['MAYA']){
                setWalletBalances(formatCacao(keepkeyInstance['MAYA'].wallet.balance[0].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[0].decimalMultiplier));
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

                if(selectedCurrency === 'CACAO'){
                    const balance = formatCacao(keepkeyInstance['MAYA'].wallet.balance[0].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[0].decimalMultiplier);
                    console.log("balance: ", balance);
                    setWalletBalances(balance);
                    const cacaoPriceValue = cacaoPrice || 0; // Add null check and default value
                    setCacaoUSD(Number(balance) * cacaoPriceValue); // Ensure balance and cacaoPrice are of type number
                }else{
                    const balance = formatCacao(keepkeyInstance['MAYA'].wallet.balance[1].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[1].decimalMultiplier);
                    console.log("balance: ", balance);
                    console.log("mayaPrice: ", mayaPrice);
                    setWalletBalances(balance);
                    const mayaPriceValue = mayaPrice || 0; // Add null check and default value
                    setCacaoUSD(Number(balance) * mayaPriceValue); // Ensure balance and cacaoPrice are of type number
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        loadWallet();
    }, [keepkeyInstance]);

    const handleMaxClick = () => {
        // Logic to set the max amount
        setAmountToSend((Number(walletBalances) - 1).toString());
    };

    const setCurrencyAndLoadBalance = async (currency:any) => {
        console.log("currency: ", currency);
        setSelectedCurrency(currency);
    };

    //selectedCurrency
    let updateBalance = async function () {
        try{
            if (keepkeyInstance && keepkeyInstance['MAYA']){
                if(selectedCurrency === 'CACAO'){
                    const balance = formatCacao(keepkeyInstance['MAYA'].wallet.balance[0].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[0].decimalMultiplier);
                    console.log("balance: ", balance);
                    setWalletBalances(balance);
                    const cacaoPriceValue = cacaoPrice || 0; // Add null check and default value
                    setCacaoUSD(Number(balance) * cacaoPriceValue); // Ensure balance and cacaoPrice are of type number
                }else{
                    const balance = formatCacao(keepkeyInstance['MAYA'].wallet.balance[1].bigIntValue, keepkeyInstance['MAYA'].wallet.balance[1].decimalMultiplier);
                    console.log("balance: ", balance);
                    setWalletBalances(balance);
                    console.log("mayaPrice: ", mayaPrice);
                    const mayaPriceValue = mayaPrice || 0; // Add null check and default value
                    setCacaoUSD(Number(balance) * mayaPriceValue); // Ensure balance and cacaoPrice are of type number
                }
            }
        }catch(e){
            console.error(e)
        }
    }
    useEffect(() => {
        updateBalance();
    }, [selectedCurrency]);

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
                                                                                    {walletBalances} {selectedCurrency} <Text fontSize={"12px"}> (~{cacaoUSD.toFixed(3)}) USD</Text>
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
                                                    <br/>
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
                                            <Button
                                                bg="#131c3d"
                                                _hover={{ bg: '#1a2249' }}
                                                border={"1px solid teal"}
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
