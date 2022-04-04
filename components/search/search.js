// getting all require elements
const searchBox = document.querySelector('.search-input');
const searchInput = searchBox.querySelector("input");
const searchSuggestions = searchBox.querySelector('.autocom-box') 

// if user presses any key and release
// TODO: add a clear button, it will appear onkeyup trigger via a LN21 element.classlist.add
//       and will essential just reset the searchInput.value to empty.
searchInput.onkeyup = (e) => {
    console.log(e.target.value)
    let userSearchTerm = e.target.value;
    let emptyArray = [];
    if (userSearchTerm) {
        emptyArray = suggestions.filter((data) =>{
            // filter array values and user characters  to lower case and return the 
            // matches that start with the search terms
            return data.toLocaleLowerCase().startsWith(userSearchTerm.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data)=>{
            return data='<li>' + data +'</li>';
        });
        searchBox.classList.add("active"); //this show the autocomplete box
        showSuggestions(emptyArray);
        let allResults = searchSuggestions.querySelectorAll("li");
        for (let i=0; i<allResults.length; i++){
            //adding an onlick attribute in all of the li tags that are shown
            allResults[i].setAttribute("onclick","selectResult(this)");
        }
    }else{
        searchBox.classList.remove("active") //this will hide the box;
    }
}

function showSuggestions(list){
    let listData;
    if (!list.length){
        userSearchTerm = searchInput.value;
        listData = '<li>' + userSearchTerm +'</li>';;

    }else{
        listData=list.join('');
    }
    searchSuggestions.innerHTML = listData;
}

function selectResult(element){
    let selectedResultTerm = element.textContent;
    searchInput.value = selectedResultTerm;
    searchBox.classList.remove("active") //this will hide the box;
    console.log('You have selected',selectedResultTerm);
}