//NFT MINTING
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId, Balance};
use near_sdk::{near_bindgen, PanicOnDefault};

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct NftMarketplace
{
    pub owner_id: AccountId,
    pub nfts: Vec<Nft>,
    pub next_token_id: u64,
}

#[derive(BorshSerialize, BorshDeserialize)] 
pub struct Nft
{
    pub token_id: u64,
    pub owner_id: AccountId,
    pub metadata: String, 
    pub price: u128,
    pub is_listed: bool,
}

#[near_bindgen]
impl NftMarketplace
{
    #[init]
    pub fn new() -> Self
    {
      Self
      {
        owner_id: env::predecessor_account_id(),
        nfts: Vec::new(),
        next_token_id: 0,
      }
    }

    #[payable]
    pub fn mint_nft(&mut self, metadata: String, price: u128, recipient_id: AccountId,_name: Option<String>)
    {
        assert!(price > 0, "Price must be positive");
        let token_id = self.next_token_id;
        self.next_token_id += 1;

        let nft = Nft
        {
            token_id,
            owner_id: recipient_id,
            metadata, 
            price,
            is_listed: true,
        };

    self.nfts.push(nft);
    }

    //pub fn get_supply(&self) -> u64
    //{
    //    self.next_token_id - 1
    //}

    pub fn nfts_owned_by(&self, account_id: AccountId) -> u64
    {
        let owned_nfts = self.nfts.iter().filter(|nft| nft.owner_id == account_id);
        let owned_nfts: Vec<&Nft> = owned_nfts.collect();
        owned_nfts.len() as u64
      }
}