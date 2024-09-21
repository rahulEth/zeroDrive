// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ZerodriveProof {
    // Constructor to set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }
    // Structure to store proof data
    address public owner;

    struct Proof {
        address userAddr;
        string dataHash;
        uint256 timestamp;
    }

    // Mapping to allow other addresses to save data on behalf of a user
    mapping(address => mapping(address => bool)) private approvals;

    // Mapping from a unique identifier to the proof
    mapping(bytes32 => Proof) public proofs;

    // Event emitted when a new proof is stored
    event ProofStored(bytes32 indexed proofId, address indexed userAddr, string indexed dataHash, uint256 timestamp);

    // Function to store a new proof
    function storeProof(address userAddr, string memory dataHash) public {
        // Generate a unique identifier for the proof
        bytes32 proofId = keccak256(abi.encodePacked(userAddr, dataHash));

        // Ensure the proof does not already exist
        require(proofs[proofId].timestamp == 0, "Proof already exists");

        // Store the proof
        proofs[proofId] = Proof({
            userAddr: userAddr,
            dataHash: dataHash,
            timestamp: block.timestamp
        });
        
        // Emit the event
        emit ProofStored(proofId, userAddr, dataHash, block.timestamp);
    }

    // Function for a user to approve owner address to save proof on their behalf
    function approve(address delegate ) external {
        approvals[msg.sender][delegate] = true;
    }

    // Function to revoke approval
    function revokeApproval(address delegate) external {
        approvals[msg.sender][delegate] = false;
    }

    // Function for an approved address to save proof on behalf of the user
    function saveProofOnBehalf(address userAddr, string memory dataHash) external {
        require(approvals[userAddr][msg.sender], "Not authorized to save proof");
        // Generate a unique identifier for the proof
        bytes32 proofId = keccak256(abi.encodePacked(userAddr, dataHash));

        // Ensure the proof does not already exist
        require(proofs[proofId].timestamp == 0, "Proof already exists");

        // Store the proof
        proofs[proofId] = Proof({
            userAddr: userAddr,
            dataHash: dataHash,
            timestamp: block.timestamp
        });
        
        // Emit the event
        emit ProofStored(proofId, userAddr, dataHash, block.timestamp);
    }    


    // Function to retrieve a proof by its unique identifier
    function getProof(bytes32 proofId) public view returns (address userAddr, string memory dataHash, uint256 timestamp) {
        Proof memory proof = proofs[proofId];
        require(proof.timestamp != 0, "Proof does not exist");
        return (proof.userAddr , proof.dataHash, proof.timestamp);
    }
}
