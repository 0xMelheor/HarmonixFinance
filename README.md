# Harmonix Finance

Like Beefy Finance and other auto-compounders, we use a system of vaults an strategies, where vault is the location where users deposit their funds, and strategy is the logic operating on them to compound those funds. But the similarities end here.

To facilitate granular control of user funds that Beefy is unable to provide (and which is needed to avoid punishing one user for withdrawal made by another), we issue NFTs to users instead of shares. Each of these NFTs can be thought of as a key to a deposit box that can only be accessed by the user and the recompounding strategy. We're the first NFT-based auto-compounder on Harmony (and probably on other chains as well).

Another bonus of this approach is that we're able to hide the share ownership within the contract itself, effectively making your data private from unwanted attention. We want the control of your data to be completely in your hands. However, if you do want to share your data with others, you can do so via a simple toggle on your vault key. Your key controls whether others can see the existence of your vault, and what you have invested in it.

In order to enable this functionality, we have built a custom ERC20 clone, that behaves like ERC20 contract from `@openzeppelin` but with few distinct differences:

- Your wallet does not store the shares, they are tracked internally within the contract for privacy.
- By default, only you (the NFT key holder) and the system (but not system admin) can see your shares. You can change this by settings the visible flag on the key to true.
- Your account is tied to your NFT key, which means that if you transfer it to someone else, you lose ability to access your shares, and someone else can now access them instead.
- You can only transfer shares to other key holders.
- If you own multiple keys (i.e. someone gave you theirs), the key with earliest creation date will be used by the system. You can deactivate keys that you don't want the system to default to.

Remember that since your NFT controls access to the vault, transferring it to another user is effectively like giving them the key. The vault data is not tied to your account, just to your NFT key.

Your NFT key has 2 flags on it, which you can toggle:

- visible: (defaults to false) Controls whether anyone aside from your and the system can see your account, and any investments within it. Because this logic is deployed/owned by the vault, nobody except you and the vault can see your account (not even the admin account that deployed the vault or the strategist). Note: if you want to take advantage of external analytics platforms such as Tin Network, you should set this to true.
- active: (defaults to true) Controls whether your key is active. An inactive key can't interact with the funds in the vault, can't send or receive transfers and to outsiders the account appears the same as non-existent account. Inactive keys do not benefit from the vault strategy. You may wish to deactivate the key for multiple reasons:
  - Privacy
  - To comply with local regulations (i.e. crypto ban)
  - To avoid conflicts with another key you hold (since the system will always use the key with earliest creation date)
  - 
Note that your funds are still safely stored in the vault if you deactivate your key and will be available to you once you reactivate it again.
