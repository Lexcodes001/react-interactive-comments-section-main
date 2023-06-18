
const handleVote = (comment, isComment, voteMode, reply) => {
  let cmtIndex = data.indexOf(comment);
  let rplyIndex = data[cmtIndex].replies.indexOf(reply);
  let returnValue = voteMode ? 1 : -1;
  
  if (isComment) {
    if (data[cmtIndex].score.voteCheck === false) {
      if (voteMode) {
        data[cmtIndex].score.count++;
      } else {
        if (data[cmtIndex].score.count === 0) {  
          return data[cmtIndex].score.count;
        } else {
          data[cmtIndex].score.count--;  
        }
      }
      data[cmtIndex].score.voteCheck = returnValue;
    } else {
      if (data[cmtIndex].score.voteCheck === -1) {
        data[cmtIndex].score.count++;
      } else {
        data[cmtIndex].score.count--;
      }
      data[cmtIndex].score.voteCheck = false;
    }
  } else {
    if (data[cmtIndex].replies[rplyIndex].score.voteCheck === false) {
      if (voteMode) {
        alert('true++');
        data[cmtIndex].replies[rplyIndex].score.count++;
      } else {
        alert('true--');
        if (data[cmtIndex].replies[rplyIndex].score.count === 0) {
          return data[cmtIndex].replies[rplyIndex].score.count;
        } else {
          data[cmtIndex].replies[rplyIndex].score.count--;
        }
      }
      data[cmtIndex].replies[rplyIndex].score.voteCheck = returnValue;
    } else{
      if (data[cmtIndex].replies[rplyIndex].score.voteCheck === -1) {
        data[cmtIndex].replies[rplyIndex].score.count++;
      } else {
        data[cmtIndex].replies[rplyIndex].score.count--;
      }
      data[cmtIndex].replies[rplyIndex].score.voteCheck = false;
    }
  }

  setData(data);
  localStorage.setItem("comments", JSON.stringify(data));
}