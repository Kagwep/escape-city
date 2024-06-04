#![no_std]

mod escape;
mod runaways;
mod storage;
mod escape_attempts;
mod runaways_factory;
mod runaway_multiply;
mod ownership;

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

/// An empty contract. To be used as a template when starting a new contract from scratch.
#[multiversx_sc::contract]
pub trait EscapeCity: escape_attempts:: EscapeAttemps + storage::StorageModule + runaways_factory::RunAwayFactory + runaway_multiply::RunAwayMultiply + ownership::RunAwayOwnership{
    #[init]
    fn init(&self) {

        self.trail_digits().set(16u8);
        self.runaway_last_index().set(1usize);
        self.escape_last_index().set(1usize);
    }

}
