
document.onreadystatechange = function() {
  if (document.readyState === 'interactive') {

    const quote = document.querySelector('#quote');
    const charName = document.querySelector('#charName');
    const charPic = document.querySelector('#charPic');
    const getNew = document.querySelector('#getNew');
    const loadingImage = document.querySelector('#loadingImage');
    const content = document.querySelector('#content');
    const textAndPic = document.querySelector('#textAndPic');
    const text = document.querySelector('#text');
    const tweetButton = document.querySelector('#tweetButton');

    var xhr;

    getNewContent();
    getNew.onclick = getNewContent;

    function getNewContent() {
      
      content.classList.add('hidden');
      loadingImage.classList.remove('hidden');

      xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText)[0];
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
      var dataImage = new Image();
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
      }

      dataImage.src = data.image;


    }

    function failure() {
      loadingImage.classList.add('hidden');
      content.classList.remove('hidden');
      alert('Sorry! Something went wrong when retrieving the data. Please refresh and try again!');
    }

  }
}
