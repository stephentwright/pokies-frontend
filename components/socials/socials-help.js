// function to hide/show a div container -- this is a click on click off effect
function showOrHideContainer(divId) {
    var x = document.getElementById(divId);
    if (!x.style.display || x.style.display == "none")  {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

// function to hide div container
function hideContainer(divId){
    const x = document.getElementById(divId);
    x.style.display = "none";
}

// function to show div container
function showContainer(divId){
    const x = document.getElementById(divId);
    x.style.display = "block";
}

// function to hide/show the help div container
// this is bad and needs to be improved as its referencing id's directly
function toggleHelpBar(selectedDiv) {
  if (selectedDiv == "how-to-container") {
    showContainer("how-to-container");
    document.getElementById("item-how-to").classList.add('active');

    hideContainer("about-container");
    document.getElementById("item-about").classList.remove('active');

    hideContainer("contact-container");
    document.getElementById("item-contact").classList.remove('active');

  }
  else if (selectedDiv == "about-container") {
    hideContainer("how-to-container");
    document.getElementById("item-how-to").classList.remove('active');

    showContainer("about-container");
    document.getElementById("item-about").classList.add('active');

    hideContainer("contact-container");
    document.getElementById("item-contact").classList.remove('active');

  }
  else if (selectedDiv == "contact-container") {
    hideContainer("how-to-container");
    document.getElementById("item-how-to").classList.remove('active');

    hideContainer("about-container");
    document.getElementById("item-about").classList.remove('active');

    showContainer("contact-container");
    document.getElementById("item-contact").classList.add('active');
  }
}