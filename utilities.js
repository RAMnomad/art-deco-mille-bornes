function arrRemove(array, val){
	for (var i = 0; i<array.length; i++){
		if (array[i] == val){
			array.slice(i,i+1);
		}
	}