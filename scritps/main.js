import { ABI, CONTRACT_ADDRESS } from "./constant.js"
import { ethers } from "./ethers-5.2.esm.min.jS"

const winEth = window.ethereum
const connectBtn = document.querySelector(".connect-btn")
const fundBtn = document.querySelector(".fund-btn")
const balanceBtn = document.querySelector(".balance-btn")
const withdrawBtn = document.querySelector(".withdraw-btn")
const ethInput = document.querySelector(".eth-input")
const subscription = document.querySelector(".subscription")

connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof winEth !== "undefined") {
        try {
            await winEth.request({
                method: "eth_requestAccounts",
            })
        } catch (e) {
            console.error(e)
        }

        const walletAddress = await winEth.request({
            method: "eth_accounts",
        })

        subscription.innerHTML = `Connected to ${walletAddress}`
        connectBtn.innerHTML = "Connected"
    } else {
        alert("Please install metamask extension on your browser to proceed !")
    }
}

async function fund() {
    const ethAmount = ethInput.value
    console.log(`Funding ${ethAmount} ...`)

    // Subsequence
    // Provider / connection to blockchain
    // Signer / wallet / someone w some gas
    // Contract which we want to interact with (ABI & Address)

    // Web3Provider automatically stick the metamask address into this
    const provider = new ethers.providers.Web3Provider(winEth)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
    try {
        const txResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        await listenForTxMined(txResponse, provider)
        console.log("Done!")
    } catch (e) {
        console.log(e)
    }
}

function listenForTxMined(txResponse, provider) {
    console.log(`Mining ${txResponse.hash} ...`)
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txRecepit) => {
            console.log(
                `Completed with ${txRecepit.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof winEth !== "undefined") {
        const provider = new ethers.providers.Web3Provider(winEth)
        const balance = await provider.getBalance(CONTRACT_ADDRESS)

        console.log(ethers.utils.formatEther(balance))
    } else {
        alert("Please install metamask extension on your browser to proceed !")
    }
}

async function withdraw() {
    console.log("Withdrawing...")
    const provider = new ethers.providers.Web3Provider(winEth)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

    try {
        const txResponse = await contract.withdraw()
        await listenForTxMined(txResponse, provider)
        console.log("Done!")
    } catch (e) {
        console.log(e)
    }
}
