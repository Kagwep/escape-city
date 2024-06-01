use crate::{storage, runaways::RunAway};

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait RunAwayFactory: storage::StorageModule {

    
    fn create_runaway(&self,owner:ManagedAddress, name: ManagedBuffer, trail_print: u64, weight:u64, experience: u64){
        self.runaway_last_index().update(|id| {
            self.new_runaway_event(*id, name.clone(), trail_print);
            let new_runaway = RunAway{
                trail_print,weight,experience,name
            };
            self.owned_runaways(&owner).insert(*id);
            self.runaway_owner(*id).set(owner);
            self.runaways(*id).set(new_runaway);
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
        let minimum_weight: u64 = 200; 
    
        let new_weight = parent_weight - (parent_weight * weight_loss_factor / 100);
        if new_weight < minimum_weight {
            minimum_weight
        } else {
            new_weight
        }
    }


    #[event("newRunawayEvent")]
    fn new_runaway_event(
        &self,
        #[indexed] zombie_id:usize,
        name: ManagedBuffer,
        #[indexed] dna:u64,
    );

}