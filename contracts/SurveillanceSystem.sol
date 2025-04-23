// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SurveillanceSystem {
    struct Metadata {
        string fileHash;
        string cloudinaryUrl;
        uint256 timestamp;
        address owner;
        bool isPrivate;
    }

    struct AccessLog {
        address user;
        uint256 timestamp;
        string action;
    }

    mapping(string => Metadata) public surveillance;
    mapping(string => AccessLog[]) public accessLogs;
    mapping(address => bool) public authorizedUsers;

    event FileAdded(string fileHash, string cloudinaryUrl, address owner);
    event AccessGranted(address user, string fileHash);
    event AccessRevoked(address user, string fileHash);

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        authorizedUsers[msg.sender] = true;
    }

    function addFile(string memory fileHash, string memory cloudinaryUrl, bool isPrivate) 
        public 
        onlyAuthorized 
    {
        surveillance[fileHash] = Metadata(
            fileHash,
            cloudinaryUrl,
            block.timestamp,
            msg.sender,
            isPrivate
        );

        AccessLog memory log = AccessLog(
            msg.sender,
            block.timestamp,
            "ADD"
        );
        accessLogs[fileHash].push(log);

        emit FileAdded(fileHash, cloudinaryUrl, msg.sender);
    }

    function grantAccess(address user) public onlyAuthorized {
        authorizedUsers[user] = true;
    }

    function revokeAccess(address user) public onlyAuthorized {
        require(user != msg.sender, "Cannot revoke own access");
        authorizedUsers[user] = false;
    }

    function getFileMetadata(string memory fileHash) 
        public 
        view 
        returns (Metadata memory) 
    {
        require(
            !surveillance[fileHash].isPrivate || authorizedUsers[msg.sender],
            "Not authorized to view this file"
        );
        return surveillance[fileHash];
    }

    function getAccessLogs(string memory fileHash) 
        public 
        view 
        onlyAuthorized 
        returns (AccessLog[] memory) 
    {
        return accessLogs[fileHash];
    }
} 