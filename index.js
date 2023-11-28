//NFT MINTING
document.addEventListener("DOMContentLoaded", () =>
    {
        const messageEl = document.getElementById("message");
        const mintNFT = async (wallet) =>
        {
            if (!wallet.isSignedIn()) {
                console.error('Log-in First');
                return;
            }

        const ipfsLink = document.getElementById("recipient-address").value;
        if(!ipfsLink) {
            console.error("IPFS link is required for Minting a NFT");
            return;
          }
        const near = await wallet.account(); 
        const result = await near.functionCall
        ({
            contractId: "nandinidusane06.testnet",
            methodName: "mint_nft",
            args:
            {
                metadata: ipfsLink,
                price: 10000000,
                recipient_id: wallet.getAccountId(),  
            },
            attachedDeposit: "10000000" 
        });
        }
    
    const nearConfig =
    {
      networkId: "testnet",
      keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };

    const connect = async (config) =>
    {
        localStorage.clear() 
        try
        {
            const near = await nearApi.connect(config);
            return near;
        }
        catch (error)
        {
            console.error("Connection error occured now:", error);
            throw error;
        }
    };

    let near;
    let walletConnection;
    const { WalletConnection, keyStores } = nearApi;
    connect(nearConfig).then(async (near) =>
    {
        near = near;
        const wallet = new WalletConnection(near);
        walletConnection = wallet;

        document.getElementById('login').addEventListener('click', () =>
        {
            wallet.requestSignIn();
        });

        document.getElementById('mint').addEventListener('click', async () =>
        {
            await mintNFT(walletConnection);
        });

        document.getElementById('getcountofNFT').addEventListener('click', async () => {
            await getcountofNFT(walletConnection);
        });

        if (wallet.isSignedIn()) 
        {
            document.getElementById('accountId').innerText = wallet.getAccountId();
            await getcountofNFT(walletConnection);
        }
        
    });

    const getcountofNFT = async (wallet) =>
    {
        if (!wallet.isSignedIn())
        {
            console.error('Log-in First');
            return;
        }
    
        const accountId = wallet.getAccountId();
    
        const contract = new nearApi.Contract(wallet.account(), 'nandinidusane06.testnet',
        {
            viewMethods: ['nfts_owned_by'],
            changeMethods: [],
        });
    
        try
        {
            const result = await contract.nfts_owned_by({ account_id: accountId });
            document.getElementById('nftsOwned').innerText = `${accountId} Has ${result} NFTs`;
            console.log(`${accountId} has ${result} NFTs`);
        }
        catch (error)
        {
            console.error('Error calling nfts_owned_by occured now:', error);
        }
    };
    
});