import { ethers } from "./ethers-5.6.esm.min.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund

console.log(ethers)
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Metamask connected"
    } else {
        connectButton.innerHTML = "Please install metamask!!!"
    }
}

function fund(ethAmount) {
    console.log(`Funding with ${ethAmount} to the contract...`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone with gas
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacting with
        // abi and addres
    }
}
