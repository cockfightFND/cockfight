module addr::chicken_and_eggs {
    use std::hash::sha3_256;
    use std::error;
    use std::string::{Self};
    use std::signer;
    use std::vector;
    use std::option;
    use std::event;
    
    use initia_std::object::{Self, Object, ExtendRef};
    use initia_std::fungible_asset::{Self, Metadata, FungibleAsset, FungibleStore};
    use initia_std::primary_fungible_store;
    use initia_std::table::{Self, Table};
    use initia_std::coin;
    use initia_std::bcs;

    //
    //  Errors
    //
    const EUNAUTHORIZED :u64 = 1;
    const EMODULE_STORE_ALREADY_EXISTS :u64 = 2;
    const EMODULE_STORE_NOT_FOUND : u64 = 3;
    const EINVALID_PRICE_INITIALIZATION :u64 = 4;
    const EINVALID_TRADE_NUM:u64 = 5;
    const EINVALID_METADATA: u64 = 6;
    const ENOT_FOUND_CHICKENS: u64 = 7;
    const EGAME_ALREADY_EXISTS: u64 = 8;
    const EINVALID_MERKLE_PROOFS: u64 = 9;
    const EINVALID_PROOF_LEGNTH: u64 = 10;

    //
    //  Constatns
    //

    //
    //  Events
    //

    struct BuyChickenEvent has drop, store {
        account: address,
        num: u64,
        total_chicken_num_in_user: u64,
    }

    struct SellChickenEvent has drop, store {
        account: address,
        num: u64,
        total_chicken_num_in_user: u64,
    }

    struct ModuleStore has key {
        deposit_extend_ref: ExtendRef,
        prize_extend_ref: ExtendRef,
        deposit_store: Object<FungibleStore>,
        prize_store: Object<FungibleStore>,
        total_chickens: u64,
        chicken_price: u64,
        egg_price: u64,
        chickens : Table<address /* user */, u64>,
        eggs: Table<address /* user */, u64>,
        cock_fights: Table<u64 /* game id */, CockFight>
    }

    // store for users
    struct CockFightStore has key {
        claimed: Table<u64 /* game id */, bool>,
    }
    
    struct CockFight has copy, drop, store {
        prize_amount: u64,
        winner_position: u64,	
        merkle_root: vector<u8> // merkle root (leaf node : hash(addr | position | eggs))
    }
    
    //
    // Helper functions
    //
    fun check_operator_permission(operator: &signer) {
        assert!(signer::address_of(operator) == @addr, error::permission_denied(EUNAUTHORIZED));
    }

    public fun create_module_address(): address {
        object::create_object_address(@addr, generate_module_seed())
    }
    
    fun generate_module_seed(): vector<u8>{
        let seed = b"chicken_and_egg";
        return seed
    }

    //
    // Entry Functions
    //

    public fun initialize(
        operator: &signer,
        chicken_price: u64,
        egg_price: u64,
        metadata: Object<Metadata>
    ) {
        check_operator_permission(operator);
        let constructor_ref = object::create_named_object(operator, generate_module_seed());
        let object = object::generate_signer(&constructor_ref);
        let object_addr = object::address_from_constructor_ref(&constructor_ref);

        assert!(!exists<ModuleStore>(object_addr), error::already_exists(EMODULE_STORE_ALREADY_EXISTS));
        assert!(chicken_price > egg_price && egg_price > 0, error::invalid_argument(EINVALID_PRICE_INITIALIZATION));
        
        let deposit_constructor_ref = object::create_named_object(operator, b"deposit");
        let prize_constructor_ref = object::create_named_object(operator, b"prize"); 
        let deposit_extend_ref = object::generate_extend_ref(&deposit_constructor_ref);
        let prize_extend_ref = object::generate_extend_ref(&prize_constructor_ref);
        object::disable_ungated_transfer(&object::generate_transfer_ref(&deposit_constructor_ref));
        object::disable_ungated_transfer(&object::generate_transfer_ref(&prize_constructor_ref));


        let deposit_store = fungible_asset::create_store(&deposit_constructor_ref, metadata);
        let prize_store = fungible_asset::create_store(&prize_constructor_ref, metadata);

        let module_store = ModuleStore{
            deposit_extend_ref,
            prize_extend_ref,
            prize_store,
            deposit_store,
            total_chickens: 0,
            chicken_price,
            egg_price,
            chickens: table::new<address,u64>(),
            eggs: table::new<address,u64>(),
            cock_fights: table::new<u64, CockFight>(),
        };
        move_to(&object, module_store);
    }

    public entry fun fund_prize_script(
        account: &signer,
        metadata: Object<Metadata>,
        amount: u64
    ) acquires ModuleStore {
        let prize = primary_fungible_store::withdraw(account, metadata, amount);
        fund_prize(prize);
    }

    
    public entry fun buy_chicken_script(
        account: &signer,
        metadata: Object<Metadata>,
        num: u64
    ) acquires ModuleStore {
        let module_addr = create_module_address();
        let module_store = borrow_global<ModuleStore>(module_addr);

        assert!(num > 0, error::invalid_argument(EINVALID_TRADE_NUM));
        assert!(fungible_asset::store_metadata(module_store.deposit_store) == metadata, error::invalid_argument(EINVALID_METADATA));
        
        buy_chicken(account, metadata, num);
    }

    public entry fun sell_chicken_script(
        account: &signer,
        metadata: Object<Metadata>,
        num: u64
    )acquires ModuleStore{
        let module_addr = create_module_address();
        let module_store = borrow_global<ModuleStore>(module_addr);

        assert!(num > 0, error::invalid_argument(EINVALID_TRADE_NUM));
        assert!(fungible_asset::store_metadata(module_store.deposit_store) == metadata, error::invalid_argument(EINVALID_METADATA));
        
        sell_chicken(account, metadata, num);
    }

    // public entry fun claim_script(
    //     account: &signer,
    //     game_id: u64,
    //     position: u64
    // ) {

    // }

    public entry fun set_cock_fight(
        operator: &signer,
        game_id: u64,
        winner_position: u64,
        prize_amount: u64,
        merkle_root: vector<u8>
    ) acquires ModuleStore {
        check_operator_permission(operator);

        let module_addr = create_module_address();
        let module_store = borrow_global_mut<ModuleStore>(module_addr);
        
        assert!(!table::contains(&mut module_store.cock_fights, game_id), error::already_exists(EGAME_ALREADY_EXISTS));
        let cock_fight = CockFight {
            prize_amount,
            winner_position,	
            merkle_root 
        };
        table::add(&mut module_store.cock_fights, game_id, cock_fight);
    }


    //
    // Implementations
    //

    fun fund_prize(
        prize: FungibleAsset
    ) acquires ModuleStore {
        let module_addr = create_module_address();
        let module_store = borrow_global_mut<ModuleStore>(module_addr);

        fungible_asset::deposit(module_store.prize_store, prize);
    }

    fun buy_chicken(
        account: &signer,
        metadata: Object<Metadata>,
        num: u64,
    ) acquires ModuleStore {
        let module_addr = create_module_address();
        let module_store = borrow_global_mut<ModuleStore>(module_addr);
        let deposit_amount = module_store.chicken_price * num;
        let deposit = primary_fungible_store::withdraw(account, metadata, deposit_amount);

        fungible_asset::deposit(module_store.deposit_store, deposit);
        
        module_store.total_chickens = module_store.total_chickens + num;
        
        if (!table::contains(&mut module_store.chickens, signer::address_of(account))){
            table::add(&mut module_store.chickens, signer::address_of(account), 0);
        };
        let chicken = table::borrow_mut(&mut module_store.chickens, signer::address_of(account));

        *chicken = *chicken + num;

        event::emit (
            BuyChickenEvent {
                account: signer::address_of(account),
                num: num,
                total_chicken_num_in_user: *chicken
            }
        )
    }   

    fun sell_chicken(
        account: &signer,
        metadata: Object<Metadata>,
        num: u64,
    ) acquires ModuleStore {
        let module_addr = create_module_address();
        let module_store = borrow_global_mut<ModuleStore>(module_addr);

        let withdraw_amount = module_store.chicken_price * num;
        let module_signer = object::generate_signer_for_extending(&module_store.deposit_extend_ref);
        let withdraw = fungible_asset::withdraw(&module_signer, module_store.deposit_store, withdraw_amount);
        let store = primary_fungible_store::ensure_primary_store_exists(signer::address_of(account), metadata);
        fungible_asset::deposit(store, withdraw);
       
        module_store.total_chickens = module_store.total_chickens - num;
        
        assert!(table::contains(&mut module_store.chickens, signer::address_of(account)), error::not_found(ENOT_FOUND_CHICKENS));
        let chicken = table::borrow_mut(&mut module_store.chickens, signer::address_of(account));
        assert!(*chicken >= num, error::invalid_argument(EINVALID_TRADE_NUM));
        *chicken = *chicken - num;

        event::emit (
            SellChickenEvent {
                account: signer::address_of(account),
                num: num,
                total_chicken_num_in_user: *chicken
            },
        );
    }
    
    fun betting_hash(
        account_addr: address,
        position: u64,
        eggs: u64,
    ): vector<u8> {
        let module_addr = create_module_address();
        let target_hash = {
            let betting_data = vector::empty<u8>();
            vector::append(&mut betting_data, bcs::to_bytes(&module_addr));
            vector::append(&mut betting_data, bcs::to_bytes(&account_addr));
            vector::append(&mut betting_data, bcs::to_bytes(&position));
            vector::append(&mut betting_data, bcs::to_bytes(&eggs));

            sha3_256(betting_data)
        };
        target_hash
    }

    /// Compare bytes and return a following result number:
    /// 0: equal
    /// 1: v1 is greator than v2
    /// 2: v1 is less than v2
    fun bytes_cmp(v1: &vector<u8>, v2: &vector<u8>): u8 {
        assert!(vector::length(v1) == 32, error::invalid_argument(EINVALID_PROOF_LEGNTH));
        assert!(vector::length(v2) == 32, error::invalid_argument(EINVALID_PROOF_LEGNTH));

        let i = 0;
        while (i < 32 ) {
            let e1 = *vector::borrow(v1, i);
            let e2 = *vector::borrow(v2, i);
            if (e1 > e2) {
                return 1
            } else if (e2 > e1) {
                return 2
            };
        };

        0
    }

    fun assert_merkle_proofs(
        merkle_proofs: vector<vector<u8>>,
        merkle_root: vector<u8>,
        target_hash: vector<u8>,
    ) {
        // must use sorted merkle tree
        let i = 0;
        let len = vector::length(&merkle_proofs);
        let root_seed = target_hash;
        while (i < len) {
            let proof = vector::borrow(&merkle_proofs, i);
            let cmp = bytes_cmp(&root_seed, proof);
            root_seed = if (cmp == 2 /* less */) {
                let tmp = vector::empty();
                vector::append(&mut tmp, root_seed);
                vector::append(&mut tmp, *proof);

                sha3_256(tmp)
            } else /* greator or equals */ {
                let tmp = vector::empty();
                vector::append(&mut tmp, *proof);
                vector::append(&mut tmp, root_seed);

                sha3_256(tmp)
            };
            
            i = i + 1;
        };

        let root_hash = root_seed;
        assert!(merkle_root == root_hash, error::invalid_argument(EINVALID_MERKLE_PROOFS));
    }

    //
    // View Functions
    //

    #[view]
    public fun get_total_chickens(): u64 acquires ModuleStore {
        let module_addr = create_module_address();
        let module_store = borrow_global<ModuleStore>(module_addr);
        module_store.total_chickens
    }

    // public fun get_eggs_per_epoch()
    // public fun get_user_chickens(user_addr)
    // public fun get_user_eggs(user_addr)

    //
    // Tests
    //

    #[test_only]
    fun initialized_coin(
        account: &signer,
        symbol: string::String,
    ): (coin::BurnCapability, coin::FreezeCapability, coin::MintCapability) {
        let (mint_cap, burn_cap, freeze_cap, _) = coin::initialize_and_generate_extend_ref (
            account,
            option::none(),
            string::utf8(b""),
            symbol,
            6,
            string::utf8(b""),
            string::utf8(b""),
        );

        return (burn_cap, freeze_cap, mint_cap)
    }

    #[test_only]
    fun test_setup(
        chain: &signer,
        operator: &signer,
        chicken_price: u64,
        egg_price: u64,
    ): (coin::MintCapability, Object<Metadata>) {
        primary_fungible_store::init_module_for_test(chain);

        let (_, _, mint_cap) = initialized_coin(chain, string::utf8(b"ETH"));
        let metadata = coin::metadata(signer::address_of(chain), string::utf8(b"ETH"));
        initialize(
            operator,
            chicken_price,
            egg_price,
            metadata
        );
        (mint_cap, metadata)
    }

    #[test(chain=@0x1, operator=@0x4fb9c533eb3f279c2d61ca206a86aa4c2eb20f3, user=@0x123)]
    fun test_trade_chicken(
        chain: &signer,
        operator: &signer,
        user: &signer,
    ) acquires ModuleStore{
        let chicken_price = 10_000;
        let egg_price = 100;
        let buy_num = 100;
        let sell_num = 40;

        let (mint_cap, metadata) = test_setup(chain, operator, chicken_price, egg_price);
        coin::mint_to(&mint_cap, signer::address_of(operator), 1_000_000_000);
        coin::mint_to(&mint_cap, signer::address_of(user), 1_000_000_000);
        fund_prize_script(operator, metadata,1_000_000_000);
        
        assert!(get_total_chickens() == 0, 1);
        assert!(coin::balance(signer::address_of(user), metadata) == 1_000_000_000, 2);
        buy_chicken_script(user, metadata, buy_num);
        assert!(get_total_chickens() == buy_num, 3);
        assert!(coin::balance(signer::address_of(user), metadata) == 1_000_000_000 - (chicken_price * buy_num), 4);

        sell_chicken_script(user, metadata, sell_num);
        assert!(get_total_chickens() == buy_num - sell_num, 5);
        assert!(coin::balance(signer::address_of(user), metadata) == 1_000_000_000 - (chicken_price * (buy_num - sell_num)), 6);
    }
}