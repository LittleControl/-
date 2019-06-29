var arr = [
    {
        name:'Little',
        age:18
    },
    {
        control:'Nothing',
        Okay:true
    }
]
for(let i = 0; i < arr.length; i++){
    for( var each in arr[i]){
        console.log(arr[i][each])
    }
}