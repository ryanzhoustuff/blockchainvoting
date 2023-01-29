pragma solidity >=0.7.0 <0.9.0;

contract Ballot {

    struct Proposal {
        string name;
        uint voteCount;
    }

    struct Voter {
        uint[] vote;
        bool voted;
        uint weight;
        bool delegated;
        address delegate__;
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;
    address[] voter_result;
    address public chairperson;
    uint[][] votes;
    uint[] votecounts;

    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;

        voters[chairperson].weight = 1;
        for (uint i=0; i<proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }
    /**
    * Gives an address the right to vote
    * Only useable by chairperson
    */
    function giveRightToVote(address voter) public {
        require(msg.sender == chairperson,
                'Only the chairperson can give access to vote');
        require(!voters[voter].voted,
                'The voter has already voted');
        require(voters[voter].weight == 0,
                'The voter has weight of 0');
        voters[voter].weight = 1;
    }

    /**
    * Allows voter to vote
    * Voter must have right to vote
    * proposal is an uint array with the first # in the array representing the voters first choice, second # in the array representing the voters second choice, etc
    * EG a proposal of ["0", "1"] means that voters first choice is choice 0 and his second choice is choice 1.
    */
    function vote(uint[] memory proposal) public {

        
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, 'Has no right to vote');
        require(!sender.voted, 'Already voted');
        sender.voted = true;
        sender.vote = proposal;
        for(uint j = 0; j < votes.length; j++){
            bool flag = true;
            for(uint i = 0; i < votes[j].length; i++){
                if(votes[j][i] != sender.vote[i]){
                    flag = false;
                    break;
                }
            }
            if(flag){
                votecounts[j] += sender.weight;
                return;
            }
        }
        votes.push(proposal);
        votecounts.push(sender.weight);
    }

    /**
    * Allows voter to delegate their vote to delegate_
    * Voter may only delegate once
    */
    function delegate(address delegate_) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, 'Has no right to delegate');
        require(!sender.delegated, 'Already delegated');
        if(voters[delegate_].voted){
            Voter storage temp = voters[delegate_];
            while(temp.delegated == true){
                temp = voters[temp.delegate__];
            }
            for(uint j = 0; j < votes.length; j++){
                bool flag = true;
                for(uint i = 0; i < votes[j].length; i++){
                    if(votes[j][i] != temp.vote[i]){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    votecounts[j] += sender.weight;
                    voters[delegate_].weight += sender.weight;
                    sender.voted = true;
                    sender.vote = temp.vote;
                    sender.weight = 0;
                    sender.delegated = true;
                    sender.delegate__ = delegate_;
                    return;
                }
            }
        }
        voters[delegate_].weight += sender.weight;
        sender.voted = true;
        sender.vote = voters[delegate_].vote;
        sender.weight = 0;
        sender.delegated = true;
        sender.delegate__ = delegate_;
        return;
    }

    /**
    * Checks for winning proposal using sequential runoff system
    */
    function winningProposal() private returns (uint winningProposal_) {
        bool[] memory inRunning = new bool[](proposals.length);
        for(uint i = 0; i < proposals.length; i++){
            inRunning[i] = true;
        }
        uint count = 0;
        while(count < proposals.length-1){
            for(uint i = 0; i < votes.length; i++){
                for(uint j = 0; j < votes[i].length; j++){
                    if(inRunning[votes[i][j]]){
                        proposals[votes[i][j]].voteCount += votecounts[i]; //tallys up the # of first place votes for each choice
                        break;
                    }
                }
            }
            uint losingVoteCount = 1000;
            for(uint i = 0; i < proposals.length; i++){
                if(proposals[i].voteCount < losingVoteCount && inRunning[i]){
                    losingVoteCount = proposals[i].voteCount; //looks for proposal with least votes
                }
            }
            for(uint i = 0; i < proposals.length; i++){
                if(proposals[i].voteCount == losingVoteCount){
                    count++;
                    inRunning[i] = false; //if proposal has least # of votes, it is no longer in contention
                }
            }

            for(uint i = 0; i < proposals.length; i++){
                proposals[i].voteCount = 0; //resets all votes
            }
            bool flag = false;
            for(uint i = 0; i < proposals.length; i++){
                if(inRunning[i]){
                    flag = true;
                }
            }
            if(flag == false){
                return proposals.length; //tie edgecase
            }
        }
        for(uint i = 0; i < inRunning.length; i++){
            if(inRunning[i]){
                return i;
            }
        }
    }

    function winnningName() public returns (string memory winningName_) {
        require(msg.sender == chairperson,
                'Only the chairperson can return results');
        if(winningProposal() == proposals.length){
            return "Tie";
        }
        winningName_ = proposals[winningProposal()].name;
    }

    //auditing functions

    function auditVoter(address voterAddress) public view returns (Voter memory auditedVoter){
        require(msg.sender == chairperson, 
            'Only the chairperson can audit voters');
        auditedVoter = voters[voterAddress];
    }

    
}