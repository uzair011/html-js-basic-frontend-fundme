import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalanceFunc
withdrawButton.onclick = withdraw

console.log(ethers)
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Metamask connected"
    } else {
        connectButton.innerHTML = "Please install metamask!!!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("inputEthAmount").value
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone with gas
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacting with abi and addres
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            console.log(`Funding with ${ethAmount} ETH amount`)
            // wait for the transaction to finish
            await listenForTransactionToMine(transactionResponse, provider)
            console.log(`Done!`)
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionToMine(transactionResponse, provider) {
    console.log(`Transaction mining ${transactionResponse.hash}...`)
    // ! Listen for the transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Transaction completed with ${transactionReceipt.confirmations} confirmations...`
            )
            resolve()
        })
    })
}

async function getBalanceFunc() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(
            `Your current balance is: ${ethers.utils.formatEther(balance)}`
        )
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing ETH...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // contract that we are interacting with abi and addres
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionToMine(transactionResponse, provider)
            console.log(`Done!`)
        } catch (e) {
            console.log(e)
        }
    }
}
