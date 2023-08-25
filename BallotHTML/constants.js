// run yarn hardhat node, and get the address from the console
// deploying "Ballot" (tx: ...
// deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 976407 gas
//export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

// copy from backend project 01-deploy-ballot.js
export const proposals = [
    "0-basketball",
    "1-soccer",
    "2-volleyball",
    "3-baseball",
    "4-softball",
    "5-other",
]

// this is copied from the backend project artifact/contracts/Ballot.sol/Ballot.json
export const abi = [
    {
        inputs: [
            {
                internalType: "string[]",
                name: "proposalNames",
                type: "string[]",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "Ballot__NotOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getProposalName",
        outputs: [
            {
                internalType: "bytes32",
                name: "option_",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "proposals_",
                type: "uint256[]",
            },
        ],
        name: "getProposalVote",
        outputs: [
            {
                internalType: "uint256",
                name: "count_",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getUniqueVoteCount",
        outputs: [
            {
                internalType: "uint256",
                name: "count_",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getVoteCountByIndex",
        outputs: [
            {
                internalType: "uint256",
                name: "option_",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index1",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "index2",
                type: "uint256",
            },
        ],
        name: "getVotesByProposalAndRank",
        outputs: [
            {
                internalType: "uint256",
                name: "votes__",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getVoteDetail",
        outputs: [
            {
                internalType: "uint256[]",
                name: "option_",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "getVoterInfo",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "weight",
                        type: "uint256",
                    },
                    {
                        internalType: "bool",
                        name: "voted",
                        type: "bool",
                    },
                    {
                        internalType: "address",
                        name: "delegate",
                        type: "address",
                    },
                    {
                        internalType: "uint256[]",
                        name: "vote",
                        type: "uint256[]",
                    },
                ],
                internalType: "struct Ballot.Voter",
                name: "voter_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "getWeight",
        outputs: [
            {
                internalType: "uint256",
                name: "weight_",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "voter",
                type: "address",
            },
        ],
        name: "giveRightToVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "ifVoted",
        outputs: [
            {
                internalType: "bool",
                name: "ifVote_",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "proposals",
        outputs: [
            {
                internalType: "bytes32",
                name: "name",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "voteCount",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "source",
                type: "string",
            },
        ],
        name: "stringToBytes32",
        outputs: [
            {
                internalType: "bytes32",
                name: "result",
                type: "bytes32",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256[]",
                name: "proposals_",
                type: "uint256[]",
            },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "voters",
        outputs: [
            {
                internalType: "uint256",
                name: "weight",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "voted",
                type: "bool",
            },
            {
                internalType: "address",
                name: "delegate",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "winnerName",
        outputs: [
            {
                internalType: "bytes32",
                name: "winnerName_",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "winningProposal",
        outputs: [
            {
                internalType: "uint256",
                name: "winningProposal_",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
]
