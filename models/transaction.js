class Transaction {
    constructor(signature, feesAmount , Receiver , Sender ) {
        this.signature = signature
        this.feesAmount = feesAmount
        this.mempool = null;
        this.block = null
        this.Receiver = Receiver
        this.Sender = Sender
    }
}