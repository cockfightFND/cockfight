module deployer::vault_contract {    
    public entry fun deposit(owner: &signer, amount: u64) {}
    public entry fun redeem(owner: &signer, amount: u64) {}
    public entry fun betting(owner: &signer, position: u64) {}
    public entry fun get_result(owner: &signer, position: u64) {}
}