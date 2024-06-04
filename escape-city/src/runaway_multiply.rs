use crate::{storage,runaways::RunAway, runaways_factory};


multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait RunAwayMultiply: storage::StorageModule + runaways_factory::RunAwayFactory {

    #[payable("EGLD")]
    #[endpoint]
    fn multiply(&self, runaway_id:usize, target_runaway_id:usize){

        require!(self.is_valid_id(runaway_id), "Invalid Source id!");
        require!(self.is_valid_id(target_runaway_id), "Invalid Target id!");

        let payment = self.call_value().egld_value();
        let auto_birth_fee = 1;

        require!(*payment == auto_birth_fee, "Wrong fee!");
      
        let caller = self.blockchain().get_caller();

        require!(caller == self.runaway_owner(runaway_id).get(), "Only onwer of Runaway can perform this opertation");

        let mut my_runaway = self.runaways(runaway_id).get();
        let target_runaway = self.runaways(target_runaway_id).get();

        require!(
            self.is_runaway_ready_to_multiply(&my_runaway),
            "Source not ready to multiply!"
        );
        require!(
            self.is_runaway_ready_to_multiply(&target_runaway),
            "Target not ready to multiply!"
        );

        let trail_digits = self.trail_digits().get();

        let max_trail_value = u64::pow(10u64, trail_digits as u32);

        let verified_target_trail = target_runaway.trail_print % max_trail_value;

        let new_trail = my_runaway.trail_print + verified_target_trail / 2;

        let new_name = ManagedBuffer::from("RunAway");

        let spring_weight = self.calculate_shed_weight(my_runaway.weight);

        let result_weight = my_runaway.weight - spring_weight;

        let experience:u64 = 0; 

        my_runaway.weight = result_weight;

        self.runaways(runaway_id).set(my_runaway);
        
        self.create_runaway(caller, new_name, new_trail,spring_weight,experience)

    }

    #[view(isReadyToMultiply)]
    fn is_ready_to_multiply(&self, runaway_id: usize) -> bool {
        require!(self.is_valid_id(runaway_id), "Invalid Runaway id!");

        let runaway = self.runaways(runaway_id).get();

        self.is_runaway_ready_to_multiply(&runaway)
    }
    
    fn is_runaway_ready_to_multiply(&self, runaway: &RunAway<Self::Api>) -> bool {
        runaway.weight > 200 
    }


}