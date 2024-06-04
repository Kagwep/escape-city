use crate::{storage, runaways::RunAway};

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait RunAwayFactory: storage::StorageModule {

    
    fn create_runaway(&self,owner:ManagedAddress, name: ManagedBuffer, trail_print: u64, weight:u64, experience: u64){
        self.runaway_last_index().update(|id| {
            let mut total_runaways = self.total_runaways().get();
            self.new_runaway_event(*id, name.clone(), trail_print);
            let new_runaway = RunAway{
                trail_print,weight,experience,name
            };
            self.owned_runaways(&owner).insert(*id);
            self.runaway_owner(*id).set(owner.clone());
            self.runaways(*id).set(new_runaway);
            total_runaways += 1;
            self.total_runaways().set(total_runaways);
            self.perform_transfer(&ManagedAddress::zero(), &owner, *id);
            *id +=1usize;
        })
    }

    #[view]
    fn generate_trail_print(&self) -> u64 {
        let mut my_trail = RandomnessSource::new();
        let trail_digits = self.trail_digits().get();
        let max_dna_value =  u64::pow(10u64,trail_digits as u32);

        my_trail.next_u64_in_range(0u64, max_dna_value)
    }

    #[endpoint]
    fn create_new_runaway(&self, name: ManagedBuffer){
        let caller = self.blockchain().get_caller();
        require!(self.owned_runaways(&caller).is_empty(), "You are are already a Runaway Owner");
        let trail = self.generate_trail_print();
        let weight:u64 = 0;
        let experience:u64 = 0;
        self.create_runaway(caller,name, trail,weight,experience);
    }


    #[view]
    fn calculate_shed_weight(&self, parent_weight: u64) -> u64 {
        let weight_loss_factor: u64 = 10; // Percentage of weight to shed

        let new_weight = parent_weight - (parent_weight * weight_loss_factor / 100);

        new_weight 
    }

    fn is_valid_id(&self, runaway_id: usize) -> bool {
        runaway_id != 0 && runaway_id < self.total_runaways().get()
    }

    fn perform_transfer(&self, from: &ManagedAddress, to: &ManagedAddress, runaway_id: usize) {
        if from == to {
            return;
        }

        let mut nr_owned_to = self.nr_owned_runaways(to).get();
        nr_owned_to += 1;

        if !from.is_zero() {
            let mut nr_owned_from = self.nr_owned_runaways(from).get();
            nr_owned_from -= 1;

            self.nr_owned_runaways(from).set(nr_owned_from);
            //self.sire_allowed_address(runaway_id).clear();
            self.approved_address(runaway_id).clear();
        }

        self.nr_owned_runaways(to).set(nr_owned_to);
        self.runaway_owner(runaway_id).set(to);

        self.transfer_event(from, to, runaway_id);
    }


    #[view(getRunAwayById)]
    fn get_runaway_by_id_endpoint(&self, runaway_id: usize) -> RunAway<Self::Api> {
        if self.is_valid_id(runaway_id) {
            self.runaways(runaway_id).get()
        } else {
            sc_panic!("Runaway does not exist!")
        }
    }

    #[event("newRunawayEvent")]
    fn new_runaway_event(
        &self,
        #[indexed] zombie_id:usize,
        name: ManagedBuffer,
        #[indexed] dna:u64,
    );

    #[event("transfer")]
    fn transfer_event(
        &self,
        #[indexed] from: &ManagedAddress,
        #[indexed] to: &ManagedAddress,
        #[indexed] token_id: usize,
    );
}