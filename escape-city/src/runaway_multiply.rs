use crate::{storage, runaways_factory};


multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait RunAwayMultiply: storage::StorageModule + runaways_factory::RunAwayFactory {

    
    #[endpoint]
    fn multiply(&self, runaway_id:usize, target_dna:u64){

        let caller = self.blockchain().get_caller();

        require!(caller == self.runaway_owner(runaway_id).get(), "Only onwer of Runaway can perform this opertation");

        let my_runaway = self.runaways(runaway_id).get();

        require!(my_runaway.weight > 200, "Runaway is inexperienced and cannot shed weight");

        let trail_digits = self.trail_digits().get();

        let max_trail_value = u64::pow(10u64, trail_digits as u32);

        let verified_target_trail = target_dna % max_trail_value;

        let new_trail = my_runaway.trail_print + verified_target_trail / 2;

        let new_name = ManagedBuffer::from("RunAway");

        let spring_weight = self.calculate_shed_weight(my_runaway.weight);

        let experience:u64 = 0; 
        
        self.create_runaway(caller, new_name, new_trail,spring_weight,experience)

    }
    
}