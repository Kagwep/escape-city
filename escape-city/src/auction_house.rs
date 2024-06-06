use crate::{storage, auction::{Auction,AuctionType}};
use crate::ownership;
use crate::runaways_factory;

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait AuctionHouse: storage::StorageModule + ownership::RunAwayOwnership + runaways_factory::RunAwayFactory {

    #[view(isUpForAuction)]
    fn is_up_for_auction(&self, runaway_id: usize) -> bool {
        !self.auction(runaway_id).is_empty()
    }

    #[view(getAuctionStatus)]
    fn get_auction_status(&self, runaway_id: usize) -> Auction<Self::Api> {
        require!(
            self.is_up_for_auction(runaway_id),
            "Kitty is not up for auction!"
        );

        self.auction(runaway_id).get()
    }

    #[view(getCurrentWinningBid)]
    fn get_current_winning_bid(&self, runaway_id: usize) -> BigUint {
        require!(
            self.is_up_for_auction(runaway_id),
            "Kitty is not up for auction!"
        );

        self.auction(runaway_id).get().current_bid
    }

    #[endpoint(createSaleAuction)]
    fn create_sale_auction(
        &self,
        runaway_id: usize,
        starting_price: BigUint,
        ending_price: BigUint,
        duration: u64,
    ) {
        
        require!(self.is_valid_transfer(runaway_id), "Runaway doesnt have enough Weight!");

        let deadline = self.blockchain().get_block_timestamp() + duration;

        require!(
            !self.is_up_for_auction(runaway_id),
            "Runaway already auctioned!"
        );
        require!(starting_price > 0, "starting price must be higher than 0!");
        require!(
            starting_price < ending_price,
            "starting price must be less than ending price!"
        );
        require!(
            deadline > self.blockchain().get_block_timestamp(),
            "deadline can't be in the past!"
        );

        self.create_auction(
            AuctionType::Selling,
            runaway_id,
            starting_price,
            ending_price,
            deadline,
        )
    }



    fn create_auction(
        &self,
        auction_type: AuctionType,
        runaway_id: usize,
        starting_price: BigUint,
        ending_price: BigUint,
        deadline: u64,
    ) {
        let caller = self.blockchain().get_caller();

        require!(self.is_valid_id(runaway_id), "Invalid runaway id!");
        require!(
            caller == self.runaway_owner(runaway_id).get()
                || caller == self.get_approved_address_or_default(runaway_id),
            "{:x} is not the owner of that Runaway nor the approved address!",
            caller
        );

        let auction = Auction::new(
            auction_type,
            starting_price,
            ending_price,
            deadline,
            caller,
        );

        self.auction(runaway_id).set(auction);

    }

    #[payable("EGLD")]
    #[endpoint]
    fn bid(&self, runaway_id: usize) {
        let payment = self.call_value().egld_value();

        require!(
            self.is_up_for_auction(runaway_id),
            "Runaway is not up for auction!"
        );

        let caller = self.blockchain().get_caller();
        let mut auction = self.auction(runaway_id).get();

        require!(
            caller != auction.runaway_owner,
            "can't bid on your own Runaway!"
        );
        require!(
            self.blockchain().get_block_timestamp() < auction.deadline,
            "auction ended already!"
        );
        require!(
            *payment >= auction.starting_price,
            "bid amount must be higher than or equal to starting price!"
        );
        require!(
            *payment > auction.current_bid,
            "bid amount must be higher than current winning bid!"
        );
        require!(
            *payment <= auction.ending_price,
            "bid amount must be less than or equal to ending price!"
        );

        // refund losing bid
        if !auction.current_winner.is_zero() {
            self.tx()
                .to(&auction.current_winner)
                .egld(&auction.current_bid)
                .transfer();
        }

        // update auction bid and winner
        auction.current_bid = payment.clone_value();
        auction.current_winner = caller;
        self.auction(runaway_id).set(auction);
    }

    #[endpoint(endAuction)]
    fn end_auction(&self, runaway_id: usize) {
        require!(
            self.is_up_for_auction(runaway_id),
            "Runaway is not up for auction!"
        );

        let auction = self.auction(runaway_id).get();

        require!(
            self.blockchain().get_block_timestamp() > auction.deadline
                || auction.current_bid == auction.ending_price,
            "auction has not ended yet!"
        );

        if !auction.current_winner.is_zero() {
            match auction.auction_type {
                AuctionType::Selling => self.transfer(auction.current_winner, runaway_id),
            }
        } 
    }

}