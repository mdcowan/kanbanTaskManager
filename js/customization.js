//**Customization of page
const themechange = page.querySelector("#themechange");
const btn = page.querySelector('header > button');
const theme1Btn = page.querySelector('#custom1');
const theme2Btn = page.querySelector('#custom2');
const theme3Btn = page.querySelector('#default');

// function to open the modal window
function openModal(){
    themechange.style.display = "block";
    theme1Btn.addEventListener('click',changeToTheme1);
    theme2Btn.addEventListener('click', changeToTheme2);
    theme3Btn.addEventListener('click', changeDefault);
}

// function to close the modal window
function closeModal(event){
    if (event.target === themechange) {
        themechange.style.display = "none";
    }
}

function changeToTheme1(){
    page.classList.add('custom1');
    if(page.classList.contains('custom2')){
        page.classList.remove('custom2');
    }
    themechange.style.display = "none";
}

function changeToTheme2(){
    page.classList.add('custom2');
    if(page.classList.contains('custom1')){
        page.classList.remove('custom1');
    }
    themechange.style.display = "none";
}

function changeDefault(){
    if(page.classList.contains('custom1')){
        page.classList.remove('custom1');
    }
    if(page.classList.contains('custom2')){
        page.classList.remove('custom2');
    }
    themechange.style.display = "none";
}

btn.addEventListener('click', openModal);
window.addEventListener('click', closeModal);