import { ethers } from "./ethers-5.2.esm.min.jS"

const eth = window.ethereum
const connectBtn = document.querySelector(".connect-btn")
const fundBtn = document.querySelector(".fund-btn")
const ethInput = document.querySelector(".eth-input")
const subscription = document.querySelector(".subscription")

connectBtn.onclick = connect
fundBtn.onclick = fund

console.log(ethers)

async function connect() {
    if (typeof eth !== "undefined") {
        try {
            await eth.request({
                method: "eth_requestAccounts",
            })
        } catch (e) {
            console.error(e)
        }

        const walletAddress = await eth.request({
            method: "eth_accounts",
        })

        subscription.innerHTML = `Connected to ${walletAddress}`
        connectBtn.innerHTML = "Connected"
    } else {
        alert("Please install metamask extension on your browser to proceed !")
    }
}

async function fund(ethAmount) {
    console.log(`Funding ${ethAmount} ...`)

    // Subsequence
    // Provider / connection to blockchain
    // Signer / wallet / someone w some gas
    // Contract which we want to interact with (ABI & Address)

    // Web3Provider automatically stick the metamask address into this
    const provider = new ethers.providers.Web3Provider(eth)
    const signer = provider.getSigner()
    const contract = ""
}
