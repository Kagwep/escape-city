multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(NestedDecode, NestedEncode,TopDecode,TopEncode, TypeAbi)]
pub struct Escape<M: ManagedTypeApi>{
    pub eid: usize,
    pub user: ManagedAddress<M>,
    pub points: u64,
}