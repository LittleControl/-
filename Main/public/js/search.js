var input = document.getElementById('search_input')
var aSearch = document.getElementById('a_search')
aSearch.onclick = function(){
    aSearch.href = '/search?key='+input.value;
}