-- Table structure for table `favorites`
CREATE TABLE IF NOT EXISTS public.favorites (
    account_id integer NOT NULL,
    inv_id integer NOT NULL,
    favorite_note text NOT NULL,
    primary key (account_id, inv_id)    
);

-- Create relationship between `favorites` and `inventory` tables
ALTER TABLE IF EXISTS public.favorites
ADD CONSTRAINT fk_inventory FOREIGN KEY (inv_id) REFERENCES public.inventory (inv_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION;

-- Create relationship between `favorites` and `account` tables
ALTER TABLE IF EXISTS public.favorites
ADD CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.account (account_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION;