class Imatge {
	constructor( img, src, onload = null ){
		this.loaded = false;
		this.source = typeof src === 'string' && src !== '' ? src : null;
		// -
		img.onload = () => {
			this.loaded = true;
			if(onload) onload();
		}
		// -
		if( this.source ){
			this.source2x = is2x ? srcx(this.source, 2) : this.source;
			this.source3x = is3x ? srcx(this.source, 3) : this.source2x;
			img.setAttribute('srcset', `${this.source3x} 3x, ${this.source2x} 2x, ${this.source} 1x` );
			// -
			img.setAttribute('src', this.source );
		}else{
			console.warn( 'La imatge no te src' );
		}
	}
}