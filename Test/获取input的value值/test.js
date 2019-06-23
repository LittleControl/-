var test = document.getElementById('test')
var a = document.getElementById('a_test')
a.onclick = function(){
    a.href = '/test?name=' + test.value
    console.log(a.href)
    a.href = 'javascript:;'
}
