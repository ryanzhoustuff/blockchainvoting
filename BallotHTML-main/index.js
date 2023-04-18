// in frontend js, cannot call require
// use import keywords
//import { ethers } from "./ethers-5.6.esm.min.js";
import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.5.4.esm.min.js"
import { abi, contractAddress, proposals } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const statusButton = document.getElementById("statusButton")
const voteButton = document.getElementById("voteButton")
const delegateButton = document.getElementById("delegateButton")
const addButton = document.getElementById("addButton")

connectButton.onclick = connect
statusButton.onclick = pollStatus
voteButton.onclick = vote
delegateButton.onclick = delegate
addButton.onclick = addVoter
debugVoterButton.onclick = debugVoter

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

async function pollStatus() {
    var statusTable = document.getElementById("statusTable")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        if (statusTable.rows.length <= 2) {
            statusTable.deleteRow(1)
            for (var i = 0; i < proposals.length; i++) {
                var x = statusTable.insertRow(i + 1)
                x.insertCell(0)
                x.insertCell(1)
                statusTable.rows[i + 1].cells[0].innerHTML = proposals[i]
            }
        }
        try {
            const count = await contract.getUniqueVoteCount()
            var start = statusTable.rows.length
            for (var i = 0; i < count - (start - proposals.length - 1); i++) {
                var x = statusTable.insertRow(start + i)
                x.insertCell(0)
                x.insertCell(1)
            }
            for (var i = 0; i < count; i++) {
                const detail = await contract.getVoteDetail(i)
                const weight = await contract.getVoteCountByIndex(i)
                statusTable.rows[proposals.length + i + 1].cells[0].innerHTML = detail
                statusTable.rows[proposals.length + i + 1].cells[1].innerHTML = weight
            }
            const proposal = await contract.winningProposal()
            if (proposal < proposals.length) {
                document.getElementById("winner").innerHTML = proposal
            } else {
                document.getElementById("winner").innerHTML = "TIE"
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}

async function vote() {
    const str = document.getElementById("proposal").value
    var proposal = str.split(",").map(function (item) {
        return parseInt(item, 10)
    })
    console.log(`Vote proposal ${proposal}...`)
    if (typeof window.ethereum !== "undefined") {
        // privider is the MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // the account we connect to is the signer
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.vote(proposal)
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

async function delegate() {
    const delegate = document.getElementById("delegate").value.trim()
    console.log(`delegate to ${delegate}...`)
    if (typeof window.ethereum !== "undefined") {
        // privider is the MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // the account we connect to is the signer
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.delegate(delegate)
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

async function addVoter() {
    const voter = document.getElementById("addVoter").value.trim()
    console.log(`Give vote right to ${voter}...`)
    if (typeof window.ethereum !== "undefined") {
        // privider is the MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // the account we connect to is the signer
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.giveRightToVote(voter)
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

async function debugVoter() {
    const voter = document.getElementById("debugVoter").value.trim()
    console.log(`Voter status of ${voter}...`)
    if (typeof window.ethereum !== "undefined") {
        // privider is the MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // the account we connect to is the signer
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const rr = await contract.getVoterInfo(voter)
            var s =
                "weight:" +
                rr.weight +
                "; voted: " +
                rr.voted +
                "; delegate: " +
                rr.delegate +
                "; vote: " +
                rr.vote
            document.getElementById("voterInfo").innerHTML = s
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask"
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(`Completed with ${transactionReceipt.confirmations} confirmations. `)
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}
