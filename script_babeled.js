document.onreadystatechange = function () {
  'use strict';

  if (document.readyState === 'interactive') {
    var getNewContent = function getNewContent() {

      content.classList.add('hidden');
      loadingImage.classList.remove('hidden');

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText)[0];
            success(data);
          } else {
            failure();
          }
        }
      };

      xhr.open('GET', 'https://thesimpsonsquoteapi.glitch.me/quotes');
      xhr.send();
    };

    var success = function success(data) {
      var dataImage = new Image();
      dataImage.onload = function () {
        quote.innerText = data.quote;
        charName.innerText = data.character;
        charPic.innerHTML = '<img src="' + data.image + '" alt="' + data.character + '" class="charImg"></img>';

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

        tweetButton.onclick = function () {
          window.open('https://twitter.com/intent/tweet?hashtags=Simpsons&related=freecodecamp&text=' + encodeURIComponent(data.quote + ' \u2014 ' + data.character), '_blank');
        };

        loadingImage.classList.add('hidden');
        content.classList.remove('hidden');
        textAndPic.classList.remove('hidden');
        failureMessage.classList.add('hidden');
        tweetButton.classList.remove('hidden');

        getNew.focus();
      };

      dataImage.src = data.image;
    };

    var failure = function failure() {
      loadingImage.classList.add('hidden');
      content.classList.remove('hidden');
      textAndPic.classList.add('hidden');
      failureMessage.classList.remove('hidden');
      tweetButton.classList.add('hidden');

      getNew.focus();
    };

    var quote = document.querySelector('#quote');
    var charName = document.querySelector('#charName');
    var charPic = document.querySelector('#charPic');
    var getNew = document.querySelector('#getNew');
    var loadingImage = document.querySelector('#loadingImage');
    var failureMessage = document.querySelector('#failureMessage');
    var content = document.querySelector('#content');
    var textAndPic = document.querySelector('#textAndPic');
    var text = document.querySelector('#text');
    var tweetButton = document.querySelector('#tweetButton');

    getNewContent();
    getNew.onclick = getNewContent;
  }
};