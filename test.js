const Blockchain = require("./models/Blockchain");
const { saveBlockchain, loadBlockchain } = require("./persistence/blockchainPersitence");

const blockchain = new Blockchain("Uemf",6,300,50,"uemfCoin")
saveBlockchain(blockchain)
.then((data)=>console.log(data))
.catch(e=>
    console.log("error on saving blockchain")
)


const testLoad = async ()=>{
    try{
     const blockchain = await loadBlockchain()
     console.log(blockchain)
    }
    catch(e)
    {
     console.log(e)
    }
 }
 testLoad()