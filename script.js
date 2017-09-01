document.onreadystatechange = function() {
  'use strict';
  if (document.readyState === 'interactive') {

    const tweetLength = 140;
    const twitterShortUrlLength = 23;

    const hashtag = 'Simpsons';

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
    
    //more concise encodeURIComponent

    function shortEncode(string) {
      return encodeURIComponent(string).replace(/%20/g, '+');
    }

    function shortDecode(string) {
      return decodeURIComponent(string.replace(/\+/g, '%20'));
    }

    const queryParams = {};
    if (window.location.search.slice(1)) {
      const queryParamArray = window.location.search.slice(1).split('&');
      queryParamArray.forEach(function(el) {
        queryParams[el.split('=')[0]] = shortDecode(el.split('=')[1]);
      });
    }

    if (queryParams.quote && queryParams.character && queryParams.image && queryParams.characterDirection) {
      showQuote({
        quote: queryParams.quote
        , character: queryParams.character
        , image: queryParams.image
        , characterDirection: queryParams.characterDirection
      });
    } else {
      getNewContent();
    }

    getNew.onclick = getNewContent;

    function getNewContent() {
      
      content.classList.add('hidden');
      loadingImage.classList.remove('hidden');

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)[0];
            showQuote(data);
          } else {
            failure();
          }
        }
      }

      xhr.open('GET', 'https://thesimpsonsquoteapi.glitch.me/quotes');
      xhr.send();

    }

    function showQuote(data) {
      const dataImage = new Image();
      dataImage.onload = function() {
        
        const nonQuoteLength = data.character.length + hashtag.length + 4; // emdash + space + hash + space
        const tweetQuoteLength = tweetLength - nonQuoteLength - twitterShortUrlLength;
        const trimmedQuote = data.quote.length > tweetQuoteLength ?
          data.quote.slice(0, tweetQuoteLength - 1) + '…'
          : data.quote;

        quote.innerText = data.quote;
        charName.innerText = data.character;
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

        const permalink = `${window.location.origin}${window.location.pathname}?quote=${shortEncode(data.quote)}&character=${shortEncode(data.character)}&image=${shortEncode(data.image)}&characterDirection=${shortEncode(data.characterDirection)}`;
        console.log(data.characterDirection);
        console.log(permalink);

        tweetButton.onclick = function() {
          window.open(`https://twitter.com/intent/tweet?text=${shortEncode(`${trimmedQuote}—${data.character}`)}&url=${shortEncode(permalink)}&hashtags=${hashtag}&related=freecodecamp`, '_blank');
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
