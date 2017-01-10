function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isWindows = /IEMobile/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
  return isiOS || isAndroid || isWindows;
}

function Select() {
  const container = document.querySelector('.select-container');
  const select = container.querySelector('select');
  const options = Array.from( select.querySelectorAll('option') );
  const ui = container.querySelector('.select-ui');
  const placeholder = container.querySelector('.select-placeholder');
  const uiOptions = ui.querySelector('.select-options');
  const liOptions = [];
  let previousActive = 0;

  if ( isMobile() ) {
    select.classList.add( 'select-it--native' );
  } else {
    ui.addEventListener('blur', close);
    ui.addEventListener('click', open);
  }

  function open( event ) {
    const isOption = event.target.getAttribute('role') === 'option';
    ui.classList.toggle( 'select-ui--is-open', ! isOption );
  }

  function close() {
    ui.classList.remove( 'select-ui--is-open');
  }

  options.forEach( addOption );
  ui.addEventListener('keydown', (event) => {
    const space = event.code === 'Space' || event.keyCode === 32;
    if ( space ) {
      ui.classList.add( 'select-ui--is-open');
    }
  });

  function addOption( node, index ) {
    const li = document.createElement('div');
    li.classList.add('select-ui-option');
    li.setAttribute('role', 'option');
    if ( node.selected ) {
      previousActive = index;
      setActive( node, li );
    }
    li.disabled = node.disabled;
    li.value = node.getAttribute('value');
    li.innerHTML = node.innerHTML;
    if ( ! node.disabled ) {
      li.addEventListener( 'click', setActiveByClick(li, index) );
    } else {
      li.classList.add('disabled');
    }
    uiOptions.appendChild(li);
    liOptions.push( li );
  }

  function setActiveByClick( node, index ) {
    function listener() {
      select.selectedIndex = index;
      placeholder.innerHTML = node.innerHTML;
      liOptions[previousActive].classList.remove('selected');
      liOptions[index].classList.add('selected')
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
      li.classList.add('selected');
    }
  }

  select.addEventListener('change', onChange);

  function onChange(event) {
    setActive( options[ select.selectedIndex ] );
    placeholder.innerHTML = options[ select.selectedIndex ].innerHTML;
    liOptions[previousActive].classList.remove('selected');
    liOptions[select.selectedIndex].classList.add('selected')
    previousActive = select.selectedIndex;
  }
}

new Select();
