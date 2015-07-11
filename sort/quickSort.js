

function quickSort(cols, begin, end){
    var key = cols[begin];
    var ki = begin;
    var high = end;
    var low = begin;
    while(high > low) {
        while(cols[high] > cols[ki]) {
            high --;
        }
        var temp = cols[high];
        cols[high] = key;
        cols[ki] = temp;
        ki = high;

        while(cols[low] < cols[ki]) {
            low ++;
        }
        var temp2 = cols[low];
        cols[low] = cols[ki];
        cols[ki] = temp2;
        ki = low;
    }
    if (begin < end) {
        quickSort(cols,begin , ki -1 );
        quickSort(cols,ki + 1, end);
    }
}

var cols = [1,4,6,8,-1,-2,-4,-3,10,5,7];

quickSort(cols, 0, 10);
console.log(cols);