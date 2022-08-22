import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    createSetAuthorityInstruction,
    AuthorityType,
    getMint,
    getAccount
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintNFT() {

    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    const fromWallet = Keypair.generate();
    const toWallet = new PublicKey("7dnYHBxvc2jPJSuH7STDrDGwQ37Lb8cvTCkpB2m3v9uz");
    let fromTokenAccount: Account;
    let mint: PublicKey;

    async function createNft() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmationTransaction(fromAirdropSignature);

        mint = await createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            0
        );

        console.log('Create NFT: ${mint.toBase58()}');

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log('Create NFT Account: ${fromTokenAccount.address.toBase58)()}');
    }

    async function mintNft() {
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            1
        );
        console.log('Mint Signature: ${signature}');
    }

    async function lockNft() {
        let transaction = new Transaction().add(createSetAuthorityInstruction(
            mint,
            fromWallet.publicKey,
            AuthorityType.MintTokens,
            null
        ));

        const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log('Lock signature: ${signature}')
    }



    return (
      <div>
        Mint NFT Section
        <div>
            <button onClick={createNft}>Create NFT</button>
            <button onClick={mintNft}>Mint NFT</button>
            <button onClick={lockNft}>Lock NFT</button>
        </div>
      </div>
    );
  }
  

export default MintNFT;