class Wallet {
    constructor(pkey = "") {
        this.pkey = pkey
        this.solde = 0
        this.ReceiveTransaction = []
        this.SendTransaction = []
    }
}
module.exports=Wallet

