use crate::{ storage,runaways_factory};

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait RunAwayOwnership: storage::StorageModule + runaways_factory::RunAwayFactory {

    #[only_owner]
    #[endpoint]
    fn claim(&self) {
        let caller = self.blockchain().get_caller();
        let egld_balance = self
            .blockchain()
            .get_sc_balance(&EgldOrEsdtTokenIdentifier::egld(), 0);

        self.tx().to(&caller).egld(&egld_balance).transfer();
    }

    #[view(totalSupply)]
    fn total_supply(&self) -> usize {
        self.total_runaways().get() - 1 // not counting genesis Runaway
    }

    #[endpoint]
    fn approve(&self, to: ManagedAddress, runaway_id: usize) {
        let caller = self.blockchain().get_caller();

        require!(self.is_valid_id(runaway_id), "Invalid runaway id!");
        require!(
            self.runaway_owner(runaway_id).get() == caller,
            "You are not the owner of that runaway!"
        );

        self.approved_address(runaway_id).set(&to);
        self.approve_event(&caller, &to, runaway_id);
    }

    #[view(balanceOf)]
    fn balance_of(&self, address: ManagedAddress) -> usize {
        self.nr_owned_runaways(&address).get()
    }

    #[view(ownerOf)]
    fn owner_of(&self, runaway_id: usize) -> ManagedAddress {
        if self.is_valid_id(runaway_id) {
            self.runaway_owner(runaway_id).get()
        } else {
            ManagedAddress::zero()
        }
    }

    
    #[endpoint]
    fn transfer(&self, to: ManagedAddress, runaway_id: usize) {
        let caller = self.blockchain().get_caller();

        require!(self.is_valid_id(runaway_id), "Invalid runaway id!");
        require!(!to.is_zero(), "Can't transfer to default address 0x0!");
        require!(
            to != self.blockchain().get_sc_address(),
            "Can't transfer to this contract!"
        );
        require!(
            self.runaway_owner(runaway_id).get() == caller,
            "You are not the owner of that runaway!"
        );

        require!(self.is_valid_transfer(runaway_id),"Runaway doesnt have enough weight");

        self.perform_transfer(&caller, &to, runaway_id);
    }

    #[endpoint]
    fn transfer_from(&self, from: ManagedAddress, to: ManagedAddress, runaway_id: usize) {
        let caller = self.blockchain().get_caller();

        require!(self.is_valid_id(runaway_id), "Invalid runaway id!");
        require!(!to.is_zero(), "Can't transfer to default address 0x0!");
        require!(
            to != self.blockchain().get_sc_address(),
            "Can't transfer to this contract!"
        );
        require!(
            self.runaway_owner(runaway_id).get() == from,
            "ManagedAddress _from_ is not the owner!"
        );
        require!(
            self.runaway_owner(runaway_id).get() == caller
                || self.get_approved_address_or_default(runaway_id) == caller,
            "You are not the owner of that Runaway nor the approved address!"
        );

        require!(self.is_valid_transfer(runaway_id),"Runaway doesnt have enough weight");

        self.perform_transfer(&from, &to, runaway_id);
    }

    fn get_approved_address_or_default(&self, runaway_id: usize) -> ManagedAddress {
        if self.approved_address(runaway_id).is_empty() {
            ManagedAddress::zero()
        } else {
            self.approved_address(runaway_id).get()
        }
    }


    #[view(tokensOfOwner)]
    fn tokens_of_owner(&self, address: ManagedAddress) -> MultiValueEncoded<usize> {
        let nr_owned_runaway = self.nr_owned_runaways(&address).get();
        let total_runaways = self.total_runaways().get();
        let mut runaway_list = ManagedVec::new();
        let mut list_len = 0; // more efficient than calling the API over and over

        for runaway_id in 1..total_runaways {
            if nr_owned_runaway as usize == list_len {
                break;
            }

            if self.runaway_owner(runaway_id).get() == address {
                runaway_list.push(runaway_id);
                list_len += 1;
            }
        }

        runaway_list.into()
    }

    fn is_valid_transfer(&self, runaway_id: usize) -> bool {
        if runaway_id > 0 && runaway_id <= self.total_runaways().get() {
            let runaway = self.runaways(runaway_id).get();
            runaway.weight > 200
        } else {
            false
        }
    }
    

    #[event("approve")]
    fn approve_event(
        &self,
        #[indexed] owner: &ManagedAddress,
        #[indexed] approved: &ManagedAddress,
        #[indexed] token_id: usize,
    );

}