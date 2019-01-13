module.exports = {

  isEmpty: function(obj){
    for (let key in obj){
      if(obj.hasOwnProperty(key)){
        return false ;
      }
    }
    return true;
  }
};

// de m3naha 2n object lw fady rag3le false wel hasOwnProperty de function by4of el gwa el object w btrg3 Boolean
