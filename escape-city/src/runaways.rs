multiversx_sc::imports!();
multiversx_sc::derive_imports!();


#[derive(NestedDecode, NestedEncode,TopDecode,TopEncode, TypeAbi)]
pub struct RunAway<M: ManagedTypeApi>{
    pub trail_print: u64,
    pub weight: u64,
    pub experience: u64,
    pub name: ManagedBuffer<M>
    
}