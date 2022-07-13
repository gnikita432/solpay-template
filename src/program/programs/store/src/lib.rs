use anchor_lang::prelude::*;

declare_id!("Ai6qd7Z2TYALRkfG5NTyNd5hoUK2wUCBtJd8d5wZAvpJ");

#[program]
pub mod store {
    use super::*;
    // handler function
    pub fn create_customer(
        ctx: Context<CreateUserStats>,
        name: String,
        item: String,
    ) -> Result<()> {
        let customer = &mut ctx.accounts.customer;
        if name.as_bytes().len() > 200 {
            panic!();
        }
        customer.name = name;
        customer.comics = vec![item];
        customer.bump = *ctx.bumps.get("customer").unwrap();
        Ok(())
    }

    pub fn add_comic(ctx: Context<AddComic>, comic: String) -> Result<()> {
        ctx.accounts.customer.comics.push(comic);
        Ok(())
    }
}

#[account]
pub struct Customers {
    name: String,
    comics: Vec<String>,
    bump: u8,
}

// validation struct
#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump
    )]
    pub customer: Account<'info, Customers>,
    pub system_program: Program<'info, System>,
}

// validation struct
#[derive(Accounts)]
pub struct AddComic<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump = customer.bump)]
    pub customer: Account<'info, Customers>,
}
