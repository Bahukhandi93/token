import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram
} from "@solana/web3.js";
import {
    createMint,
    NATIVE_MINT,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createSyncNativeInstruction,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    createSetAuthorityInstruction,
    AuthorityType,
    getMint,
    getAccount,
    closeAccount
} from "@solana/spl-token";

function SendSol() {
    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    const fromWallet = Keypair.generate();
    const toWallet = new PublicKey("7dnYHBxvc2jPJSuH7STDrDGwQ37Lb8cvTCkpB2m3v9uz");
    let associatedTokenAccount: PublicKey;

    async function wrapSol() {
        const airdropSignature = await connection.requestAirdrop(fromWallet.publicKey, 2 * LAMPORTS_PER_SOL);
        await connection.confirmationTransaction(airdropSignature);

        associatedTokenAccount = await getAssociatedTokenAddress(
            NATIVE_MINT,
            fromWallet.publicKey
        );

        const ataTransaction = new Transaction().add(createAssociatedTokenAccountInstruction(
            fromWallet.publicKey,
            associatedTokenAccount,
            fromWallet.publicKey,
            NATIVE_MINT
        ));

        await sendAndConfirmTransaction(connection, ataTransaction, [fromWallet]);

        const solTransferTransaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: associatedTokenAccount,
            lmaports: LAMPORTS_PER_SOL
        }),
        createSyncNativeInstruction(associatedTokenAccount)
        );
        
        await sendAndConfirmTransaction(connection, solTransferTransaction, [fromWallet]);
        const accountInfo = await getAccount(connection, associatedTokenAccount);

        console.log('Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}');


    }

    async function unwrapSol() {

    }

    async function sendSol() {

    }

    return (
        <div>
            Send Sol Section
            <div>
                <button onClick= {wrapSol}>Wrap SOL</button>
                <button onClick= {unwrapSol}>Unwrap SOL</button>
                <button onClick= {sendSol}>Send SOL</button>
            </div>
        </div>

    );
}

export default SendSol;