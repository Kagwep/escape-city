use multiversx_sc::derive_imports::*;

use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress},
};

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub enum AuctionType {
    Selling
}

#[type_abi]
#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode)]
pub struct Auction<M: ManagedTypeApi> {
    pub auction_type: AuctionType,
    pub starting_price: BigUint<M>,
    pub ending_price: BigUint<M>,
    pub deadline: u64,
    pub runaway_owner: ManagedAddress<M>,
    pub current_bid: BigUint<M>,
    pub current_winner: ManagedAddress<M>,
}

impl<M: ManagedTypeApi> Auction<M> {
    pub fn new(
        auction_type: AuctionType,
        starting_price: BigUint<M>,
        ending_price: BigUint<M>,
        deadline: u64,
        runaway_owner: ManagedAddress<M>,
    ) -> Self {
        Auction {
            auction_type,
            starting_price,
            ending_price,
            deadline,
            runaway_owner,
            current_bid: BigUint::zero(),
            current_winner: ManagedAddress::zero(),
        }
    }
}