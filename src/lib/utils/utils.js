// - Events
export function unifyEvents(e) { 
    return e.changedTouches ? e.changedTouches[0] : e;
}


// - Sharers ------------------------------------------------------
export function shareTo( _client, _text, _url, _twitterUser, _asunto ){
    let url = '',
        wPopup = 650,
        hPopup = 500;
    //-
    switch( _client ){
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?t=${_text}`;
            if(_url){
                url += `&u=${_url}`;
            }
            break;

        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${_text}&via=${_twitterUser}`;
            if(_url){
                url += `&url=${_url}`;
            }
            break;

        case 'linkedin':
            url = `https://www.linkedin.com/shareArticle?mini=true&title=${_text}&summary=${_text}&source=${_twitterUser}`;
            if(_url){
                url += `&url=${_url}`;
            }
            break;

        case 'whatsapp':
            url = `whatsapp://send?text=`;
            if(_asunto){
                url += `${_asunto}:%20`;
            }
            url += `${_text}`;
            if(_url){
                url += `%20-%20${_url}`;
            }
            break;

        case 'mail':
            url = `mailto:?subject=${_asunto || _text}&body=${_text}%0D%0A${_url}`;
            break;
    }
    //- console.log( url );
    //-
    var windowFeatures = `status=no,height=${hPopup},width=${wPopup},resizable=no,left=0,top=0,screenX=0,screenY=0,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`;
    window.open( url, 'sharer', windowFeatures );
};

export function nativeShareTo( _text, _url, _callback ){
    if ("share" in navigator) {
        navigator
          .share({
            title: _text,
            url: _url
          })
          .then(() => {
            console.log("Callback after sharing");
          })
          .catch(console.error);
    } else {
        _callback();
    }
}