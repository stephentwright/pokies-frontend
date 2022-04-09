// getting all require elements
const searchBox = document.querySelector('.search-input');
const searchInput = searchBox.querySelector("input");
const searchSuggestions = searchBox.querySelector('.autocom-box')

// fetch the search terms
// TODO: this can be cleaned up significantly
const urlSearchTerms = '/alphabuild/resources/json/searchTerms.json';
const searchTerms = [];
const searchTermsLgaName = [];
const searchTermsLgaCode = [];
let lgaSelection='11650';

fetch(urlSearchTerms)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            searchTerms.push(element["searchTerm"]);
            searchTermsLgaName.push(element["lgaClean"]);
            searchTermsLgaCode.push(element["LGA_CODE_2020"]);
        })
    })

// if user presses any key and release
// TODO: add a clear button, it will appear onkeyup trigger via a LN21 element.classlist.add
//       and will essential just reset the searchInput.value to empty.
searchInput.onkeyup = (e) => {
    let userSearchTerm = e.target.value;
    let emptyArray = [];
    if (userSearchTerm) {
        emptyArray = searchTerms.filter((data) =>{
            // filter array values and user characters  to lower case and return the 
            // matches that start with the search terms
            return data.toLocaleLowerCase().startsWith(userSearchTerm.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data)=>{
            //get the list to pass in the LGA clean Name to pass in         
            return data='<li>' + getTitleCase(data) +' (<b>' + searchTermsLgaName[searchTerms.indexOf(data)] + ' LGA</b>) </li>';
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

function getTitleCase(str) {
    const titleCase = str
      .split(' ')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    return titleCase;
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

    //set the LGA selection variable on correct mapping;
    const indexSearchTerm = searchTerms.indexOf(selectedResultTerm.toLocaleLowerCase().split(' (')[0]);
    lgaSelection = searchTermsLgaCode[indexSearchTerm];
    
    console.log('index:'+ indexSearchTerm);
    console.log('lgaCode:'+ lgaSelection);
    console.log('You have selected',selectedResultTerm);


    loadLgaPolygon(lgaSelection);
    createLgaPopupInformation(lgaSelection);
    loadVenueInformation(lgaSelection)
}