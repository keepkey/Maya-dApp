import React from 'react';
import {
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Text,
    Badge,
    HStack
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import { useCacaoPrice } from '../contexts/CacaoPriceContext';
export interface HeaderProps {
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    isConnected: boolean;
}

const Header = ({ connectWallet, disconnectWallet, isConnected }: HeaderProps) => {
    const cacaoPrice = useCacaoPrice(); // Use the hook to get the current CACAO price
    console.log("cacaoPrice: ", cacaoPrice)
    return (
        <Flex justifyContent="space-between" alignItems="center" p={2} bg="#131c3d" color="white" border={"1px solid teal"} borderRadius={"10px"}>
            <Box>
                <HStack>

                    <Image src="/maya.jpg" alt="Maya Logo" boxSize={"48px"} style={{ borderRadius: 'base' }} />
                    <Badge colorScheme="green" borderRadius="full" px="2">
                        {cacaoPrice} USD
                    </Badge>
                </HStack>
            </Box>
            <Text fontSize={"36px"}>MayaChain</Text>
            <Menu>
                <Box style={{ position: 'relative' }}>
                    <MenuButton
                        boxSize={"0px"}
                        _hover={{ background: 'transparent' }}
                        bg={"transparent"}
                        leftIcon={<Image src="/keepkey.png" boxSize={"44px"} />}
                        as={Button}
                        onClick={!isConnected ? connectWallet : undefined}
                        aria-label="Options"
                    >
                        <FaCircle style={{ borderRadius: '100%', border: '1px solid white', color: isConnected ? 'green' : 'red', position: 'absolute', bottom: '0', right: '0', marginRight: '-5px', marginBottom: '-25px' }} />
                    </MenuButton>
                </Box>
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

export default Header;
