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
        if(findVote(sender.vote) != votes.length+1){
            votecounts[findVote(sender.vote)] += sender.weight;
            return;
        }
        votes.push(proposal);
        votecounts.push(sender.weight);
    }

    function findVote(uint[] memory proposal) private view returns (uint){
        for(uint j = 0; j < votes.length; j++){
            bool flag = true;
            for(uint i = 0; i < votes[j].length; i++){
                if(votes[j][i] != proposal[i]){
                    flag = false;
                    break;
                }
            }
            if(flag){
                return j;
            }
        }
        return votes.length+1;
    }

    /**
    * Allows voter to delegate their vote to delegate_
    */
    function delegate(address delegate_) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, 'Has no right to delegate');
        require(!sender.delegated, 'Already delegated');
        if(voters[delegate_].voted){
            Voter storage temp = voters[delegate_];
            while(temp.delegated){
                temp = voters[temp.delegate__];
            }
            if(findVote(temp.vote) != votes.length+1){
                votecounts[findVote(temp.vote)] += sender.weight;
                temp.weight += sender.weight;
                sender.voted = true;
                sender.vote = temp.vote;
                sender.delegated = true;
                sender.delegate__ = delegate_;
            }
        }
        voters[delegate_].weight += sender.weight;
        sender.voted = true;
        sender.vote = voters[delegate_].vote;
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

    /**
    * Returns name of winning proposal
    */
    function winnningName() public returns (string memory winningName_) {
        require(msg.sender == chairperson,
                'Only the chairperson can return results');
        if(winningProposal() == proposals.length){
            return "Tie";
        }
        winningName_ = proposals[winningProposal()].name;
    }

    //auditing functions

    /**
    * Returns info about voter: who they voted for, who they delegated to
    * Only useable by chairperson
    */
    function auditVoter(address voterAddress) public view returns (Voter memory auditedVoter){
        require(msg.sender == chairperson, 
            'Only the chairperson can audit voters');
        auditedVoter = voters[voterAddress];
    }

    /**
    * If voter has voted, returns who they voted for
    * If voter delegated, returns who that delegate voted for
    */ 
    function checkMyVote() public view returns (uint[] memory){
        Voter storage sender = voters[msg.sender];
        require(sender.voted, 'You have not voted yet');
        if(!sender.delegated){
            return sender.vote;
        }else{
            Voter storage temp = voters[sender.delegate__];
            while(temp.delegated){
                temp = voters[temp.delegate__];
            }
            return temp.vote; //if your delegate has reset their vote, it will show that you have no vote
        }
    }    

    /**
    * Combination of clearVote_ and clearDelegate
    * If voter has voted, run clearVote_; if voter has delegated, run clearDelegate
    */
    function clearVote() public {
        Voter storage sender = voters[msg.sender];
        require(sender.voted, 'You have not voted yet');
        if(sender.delegated){
            clearDelegate();
        }else{
            clearVote_();
        }
    }

    /**
    * If voter has voted, clears their vote and updates votecount
    */
    function clearVote_() private {
        Voter storage sender = voters[msg.sender];
        votecounts[findVote(sender.vote)] -= sender.weight;
        sender.voted = false;
        sender.vote = new uint[](0);
    } 

    /**
    * If voter had delegated, clears their delegate and updates votecount
    */
    function clearDelegate() private {
        Voter storage sender = voters[msg.sender];
        Voter storage temp = voters[sender.delegate__];
        while(temp.delegated){
            temp = voters[temp.delegate__];
        }
        if(temp.voted){
            votecounts[findVote(temp.vote)] -= sender.weight;
            temp.weight -= sender.weight;
            sender.delegated = false;
            sender.voted = false;
            sender.vote = new uint[](0);
        }else{
            temp.weight -= sender.weight;
            sender.delegated = false;
            sender.voted = false;
            sender.vote = new uint[](0);
        }
    }
}