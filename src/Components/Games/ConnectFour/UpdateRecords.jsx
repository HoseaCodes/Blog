

const handleUpdateRecord = (winner, record) => {
    let newRecord = {...record};
    newRecord[winner]++;
    return newRecord;
  };
  
  export default { handleUpdateRecord };