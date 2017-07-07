document.onreadystatechange = function() {
  'use strict';
  if (document.readyState === 'interactive') {

    const quote = document.querySelector('#quote');
    const charName = document.querySelector('#charName');
    const charPic = document.querySelector('#charPic');
    const getNew = document.querySelector('#getNew');
    const loadingImage = document.querySelector('#loadingImage');
    const failureMessage = document.querySelector('#failureMessage');
    const content = document.querySelector('#content');
    const textAndPic = document.querySelector('#textAndPic');
    const text = document.querySelector('#text');
    const tweetButton = document.querySelector('#tweetButton');

    getNewContent();
    getNew.onclick = getNewContent;

    function getNewContent() {
      
      content.classList.add('hidden');
      loadingImage.classList.remove('hidden');

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)[0];
            success(data);
          } else {
            failure();
          }
        }
      }

      xhr.open('GET', 'https://thesimpsonsquoteapi.glitch.me/quotes');
      xhr.send();

    }

    function success(data) {
      const dataImage = new Image();
      dataImage.onload = function() {
        quote.innerHTML = data.quote;
        charName.innerHTML = data.character;
        charPic.innerHTML = `<img src="${data.image}" alt="${data.character}" class="charImg"></img>`
        
        if (data.characterDirection.toLowerCase() === 'left') {
          textAndPic.classList.add('picAtLeft');
          textAndPic.classList.remove('picAtRight');

          text.classList.add('paddingLeft');
          text.classList.remove('paddingRight');
        } else {
          textAndPic.classList.add('picAtRight');
          textAndPic.classList.remove('picAtLeft');

          text.classList.add('paddingRight');
          text.classList.remove('paddingLeft');
        }

        tweetButton.onclick = function() {
          window.open(`https://twitter.com/intent/tweet?hashtags=Simpsons&related=freecodecamp&text=${data.quote} — ${data.character}`.replace(';','%3B'), '_blank');
      }
        
        loadingImage.classList.add('hidden');
        content.classList.remove('hidden');
        textAndPic.classList.remove('hidden');
        failureMessage.classList.add('hidden');
        tweetButton.classList.remove('hidden');

        getNew.focus();
      }

      dataImage.src = data.image;


    }

    function failure() {
      loadingImage.classList.add('hidden');
      content.classList.remove('hidden');
      textAndPic.classList.add('hidden');
      failureMessage.classList.remove('hidden');
      tweetButton.classList.add('hidden');

      getNew.focus();
    }

  }
}
