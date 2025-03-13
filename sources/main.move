module AptExchange {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::aptos_coin;

    struct LiquidityPool has key {
        apt_balance: u64,
        token_balance: u64,
        total_shares: u64, // Total liquidity provider shares
    }

    public entry fun initialize_pool(
        account: &signer,
        initial_apt: u64,
        initial_token: u64
    ) {
        let pool = LiquidityPool {
            apt_balance: initial_apt,
            token_balance: initial_token,
            total_shares: 1000, // Give initial liquidity provider base shares
        };
        move_to(account, pool);
    }


    public entry fun add_liquidity(
        account: &signer,
        apt_amount: u64,
        token_amount: u64
    ) acquires LiquidityPool {
        let pool = borrow_global_mut<LiquidityPool>(signer::address_of(account));

        let shares = (apt_amount * pool.total_shares) / pool.apt_balance;
        pool.apt_balance += apt_amount;
        pool.token_balance += token_amount;
        pool.total_shares += shares;
    }


    public entry fun swap_apt_for_token(
        account: &signer,
        amount_in: u64
    ) acquires LiquidityPool {
        let pool = borrow_global_mut<LiquidityPool>(signer::address_of(account));

        let amount_in_with_fee = (amount_in * 997) / 1000; // 0.3% fee
        let token_out = (amount_in_with_fee * pool.token_balance) / (pool.apt_balance + amount_in_with_fee);

        assert!(token_out > 0, 1); // Prevents zero-value swaps


        pool.apt_balance += amount_in;
        pool.token_balance -= token_out;

        coin::transfer<Token>(account, signer::address_of(account), token_out);
    }

    public entry fun remove_liquidity(
        account: &signer,
        share_amount: u64
    ) acquires LiquidityPool {
        let pool = borrow_global_mut<LiquidityPool>(signer::address_of(account));

        let apt_out = (share_amount * pool.apt_balance) / pool.total_shares;
        let token_out = (share_amount * pool.token_balance) / pool.total_shares;

        pool.apt_balance -= apt_out;
        pool.token_balance -= token_out;
        pool.total_shares -= share_amount;

        // Transfer funds back to the user
        coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), apt_out);
        coin::transfer<Token>(account, signer::address_of(account), token_out);
    }
}
