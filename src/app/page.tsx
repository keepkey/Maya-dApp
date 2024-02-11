"use client"
/*
    * KeepKey Wallet Integration Example

 */
import { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useToast,
    VStack,
    Box,
    Button,
    Flex,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    ChakraProvider,
    useColorMode,
    useDisclosure,
    AvatarBadge,
    IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useKeepKeyWallet } from './contexts/WalletProvider';
import { theme } from './styles/theme';
import Image from 'next/image';

const ForceDarkMode = ({ children }: { children: React.ReactNode }) => {
    const { setColorMode } = useColorMode();

    useEffect(() => {
        setColorMode('dark');
    }, [setColorMode]);

    return <>{children}</>;
};

interface HeaderProps {
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    isConnected: boolean;
}

const Header = ({ connectWallet, disconnectWallet, isConnected }: HeaderProps) => {
    return (
        <Flex justifyContent="space-between" alignItems="center" p={4} bg="gray.800" color="white">
            <Image src="/maya.jpg" alt="Maya Logo" width={60} height={60} style={{ borderRadius: 'base' }} />
            <Box>Mayachain</Box>
            <Menu>
                <MenuButton as={Button} onClick={!isConnected ? connectWallet : undefined} aria-label="Options">
                    <Avatar size="lg" src="/keepkey.png" borderRadius="base" />
                </MenuButton>
                <MenuList>
                    {!isConnected && (
                        <MenuItem onClick={connectWallet}>Connect Wallet</MenuItem>
                    )}
                    {isConnected && (
                        <MenuItem onClick={disconnectWallet}>Disconnect Wallet</MenuItem>
                    )}
                    <MenuItem>Settings</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

const Home = () => {
    const { connectWallet, disconnectWallet, keepkeyInstance } = useKeepKeyWallet();
    const isConnected = !!keepkeyInstance;
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalances, setWalletBalances] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure(); // Add disclosure for modal
    const [isPairing, setIsPairing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputAmount, setInputAmount] = useState('');
    const [sendAmount, setSendAmount] = useState<any | undefined>();
    const [recipient, setRecipient] = useState('');
    const [modalType, setModalType] = useState(''); // Add state for modal type
    const [avatarUrl, setAvatarUrl] = useState('https://pioneers.dev/coins/mayachain.png');

    let handleSend = async function(){
        try{

        }catch(e){

        }
    }

    let loadWallet = async function(){
        try{
            console.log("keepkeyInstance: ", keepkeyInstance);
            if(keepkeyInstance && keepkeyInstance['MAYA']){
                const address = keepkeyInstance['MAYA'].wallet.address;
                const balances = keepkeyInstance['MAYA'].wallet.balance;
                setWalletAddress(address);
                setWalletBalances(balances);
            }
        }catch(e){
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
                        <Box textAlign="center" mt={4}>
                            {isConnected ? (
                                <div>
                                    <VStack align="start" borderRadius="md" p={6} spacing={5}>
                                        <Modal
                                            isOpen={isOpen}
                                            onClose={() => {
                                                onClose();
                                                setModalType('');
                                            }}
                                            size="xl"
                                        >
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Choose Asset</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    {modalType === 'SELECT' && (
                                                        <div>
                                                            <AssetSelect onSelect={onSelect} />
                                                        </div>
                                                    )}
                                                </ModalBody>
                                                <ModalFooter />
                                            </ModalContent>
                                        </Modal>
                                        <Heading as="h1" mb={4} size="lg">
                                            Send Crypto!
                                        </Heading>

                                        {isPairing ? (
                                            <Box>
                                                <Text mb={2}>
                                                    Connecting to {context}...
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
                                                                <Image rounded="full" src={'/keepkey'} width={'40'} height={'40'} />
                                                            </AvatarBadge>
                                                        </Avatar>
                                                    </Box>
                                                    <Box>
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
                                                            onChange={(e) => setRecipient(e.target.value)}
                                                            placeholder="Address"
                                                            value={recipient}
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Input Amount:</FormLabel>
                                                        <Input
                                                            onChange={(e) => handleInputChange(e.target.value)}
                                                            placeholder="0.0"
                                                            value={inputAmount}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <br />
                                                <Text>
                                                    Available Balance:
                                                </Text>
                                            </div>
                                        )}

                                        <Button
                                            colorScheme="green"
                                            w="full"
                                            mt={4}
                                            // isLoading={isSubmitting}
                                            onClick={handleSend}
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
                    </Flex>
                </Box>
            </ForceDarkMode>
        </ChakraProvider>
    );
};

export default Home;
