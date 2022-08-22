import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    getMint,
    getAccount
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {

    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    const fromWallet = Keypair.generate();
    const toWallet = new PublicKey("7dnYHBxvc2jPJSuH7STDrDGwQ37Lb8cvTCkpB2m3v9uz");
    let fromTokenAccount: Account;
    let mint: PublicKey;

    async function createToken() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmationTransaction(fromAirdropSignature);

        mint = await createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            9 // 10000000000 = 10 SOL
        );
        console.log('Create Token: ${mint.toBase58)()}');

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log('Create Token Account: ${fromTokenAccount.address.toBase58)()}');
    }

    async function mintToken() {
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            1000000000 //1 billion
        );
        console.log('Mint Signature: ${signature}');
    }

    async function checkBalance() {
        const mintInfo = await getMint(connection, mint);
        console.log('Supply : ${mintInfo.supply}');

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log('Amount in token account : ${tokenAccountInfo.amount}');
    }

    async function sendToken() {
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            toWallet,
        );
        console.log("Receiver's address:  ${toTokenAccount.address}");

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000
        );
        console.log('Transfer completed with signature: ${signature}');
    }



    return (
      <div>
        Mint Token Section
        <div>
            <button onClick={createToken}>Create Token</button>
            <button onClick={mintToken}>Mint Token</button>
            <button onClick={checkBalance}>Check Balance</button>
            <button onClick={sendToken}>Send Token</button>
        </div>
      </div>
    );
  }
  

export default MintToken;