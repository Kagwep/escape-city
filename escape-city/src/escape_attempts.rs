use crate::{storage, escape::Escape};

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait EscapeAttemps: storage::StorageModule {
    fn create_escape(&self, points: u64){
        self.escape_last_index().update(|id| {
            let caller = self.blockchain().get_caller();
           self.new_escape_event(*id, caller.clone(), points);
            let new_escape = Escape{
                eid: id.clone(),user:caller,points
            };
            self.escapes(*id).set(new_escape);
            *id +=1usize;
        })
    }

    #[view]
    fn calculate_points(&self, distance: u64) -> u64 {
        let base_points_per_km: u64 = 10;
        let bonus_threshold: u64 = 100;  // Distance threshold for bonus
        let bonus_multiplier: u64 = 2;  // Multiplier for distances above the threshold
    
        if distance > bonus_threshold {
            let normal_points = bonus_threshold * base_points_per_km;
            let bonus_points = (distance - bonus_threshold) * (base_points_per_km * bonus_multiplier);
            normal_points + bonus_points
        } else {
            distance * base_points_per_km
        }
    }

    #[endpoint]
    fn create_escape_attempt_feed_runaway(&self, distance_covered: u64,  runaway_id:usize){

        let  points = self.calculate_points(distance_covered);

        self.create_escape(points);

        let mut new_weight = points / 10;

        let mut  my_runaway = self.runaways(runaway_id).get();

        if my_runaway.experience % 100 == 0 {
            new_weight += 10
        }

        my_runaway.weight = new_weight;
        my_runaway.experience = my_runaway.experience + 1;

        self.runaways(runaway_id).set(&my_runaway);
    
    }

    #[event("newEscapeEvent")]
    fn new_escape_event(
        &self,
        #[indexed] escape_id:usize,
        user: ManagedAddress,
        #[indexed] points:u64,
    );
}