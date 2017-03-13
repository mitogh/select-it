function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isWindows = /IEMobile/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
  return isiOS || isAndroid || isWindows;
}

const defaultOptions = {
  container: null,
  uiContainer: '.select-it',
  uiPlaceholder: '.select-it__placeholder',
  classNames: {
    open: 'select-it--is-open',
    selected: 'selected',
    disabled: 'disabled',
    native: 'select-it--native',
  },
};

const passiveEvent = { passive: true };

function Select( userOptions ) {
  const options = Object.assign( defaultOptions, userOptions );
  if ( ! options.container ) {
    console.error( 'A container must be supplied' );
    return;
  }
  const select = options.container.querySelector('select');
  const optionsEl = Array.from( select.querySelectorAll('option') );
  const ui = options.container.querySelector( options.uiContainer );
  const placeholder = options.container.querySelector('.select-placeholder');
  const uiOptions = ui.querySelector('.select-options');
  const liOptions = [];
  let previousActive = 0;

  if ( isMobile() ) {
    select.classList.add( options.classNames.native );
  } else {
    ui.addEventListener( 'blur', close, passiveEvent );
    ui.addEventListener( 'click', open, passiveEvent );
  }

  function open( event ) {
    const isOption = event.target.getAttribute( 'role' ) === 'option';
    ui.classList.toggle( options.classNames.open, ! isOption );
  }

  function close() {
    ui.classList.remove( options.classNames.open );
  }

  optionsEl.forEach( addOption );
  select.addEventListener( 'change', onChange, passiveEvent );
  ui.addEventListener( 'keydown', keyDownListener, passiveEvent );

  function keyDownListener( event ) {
    const isSpaceKey = event.code === 'Space' || event.keyCode === 32;
    ui.classList.toggle( options.classNames.open, isSpaceKey );
  }

  function addOption( node, index ) {
    const option = document.createElement('div');
    option.classList.add('select-it-option');
    option.setAttribute('role', 'option');
    if ( node.selected ) {
      previousActive = index;
      setActive( node, option );
    }
    option.disabled = node.disabled;
    option.value = node.getAttribute('value');
    option.innerHTML = node.innerHTML;
    if ( node.disabled ) {
      option.classList.add( options.classNames.disabled );
    } else {
      option.addEventListener( 'click', setActiveByClick(option, index) );
    }
    uiOptions.appendChild(option);
    liOptions.push( option );
  }

  function setActiveByClick( node, index ) {
    function listener() {
      select.selectedIndex = index;
      placeholder.innerHTML = node.innerHTML;
      liOptions[previousActive].classList.remove( options.classNames.selected );
      liOptions[index].classList.add( options.classNames.selected )
      previousActive = index;
    }
    return listener;
  }

  function setActive( node, li ) {
    if ( placeholder.innerHTML === '' && ! placeholder.hasInitialPlaceholder ) {
      placeholder.innerHTML = node.innerHTML;
      placeholder.hasInitialPlaceholder = true;
    }
    if ( li ) {
      li.classList.add( options.classNames.selected );
    }
  }

  function onChange(event) {
    setActive( optionsEl[ select.selectedIndex ] );
    placeholder.innerHTML = optionsEl[ select.selectedIndex ].innerHTML;
    liOptions[previousActive].classList.remove( options.classNames.selected );
    liOptions[select.selectedIndex].classList.add( options.classNames.selected )
    previousActive = select.selectedIndex;
  }
}

new Select({
  container: document.querySelector('.select-container'),
});
