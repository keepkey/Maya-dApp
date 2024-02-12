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
    Text
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';

export interface HeaderProps {
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    isConnected: boolean;
}

const Header = ({ connectWallet, disconnectWallet, isConnected }: HeaderProps) => {
    return (
        <Flex justifyContent="space-between" alignItems="center" p={2} bg="#131c3d" color="white" border={"1px solid white"} borderRadius={"10px"}>
            <Image src="/maya.jpg" alt="Maya Logo" boxSize={"48px"} style={{ borderRadius: 'base' }} />
            <Text fontSize={"36px"}>Mayachain</Text>
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
