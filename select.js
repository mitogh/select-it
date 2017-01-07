function Select() {
  const container = document.querySelector('.select-container');
  const select = container.querySelector('select');
  const options = Array.from( select.querySelectorAll('option') );
  const ui = container.querySelector('.select-ui');
  const placeholder = container.querySelector('.select-placeholder');
  const uiOptions = ui.querySelector('.select-options');
  const liOptions = [];
  let previousActive = 0;

  options.forEach( addOption );
  uiOptions.classList.add('disabled');
  placeholder.addEventListener('click', () => {
    uiOptions.classList.toggle('disabled');
  });
  function addOption( node, index ) {
    const li = document.createElement('li');
    if ( node.selected ) {
      previousActive = index;
      setActive( node, li );
    }
    li.disabled = node.disabled;
    li.value = node.getAttribute('value');
    li.innerHTML = node.innerHTML;
    if ( ! node.disabled ) {
      li.addEventListener( 'click', setActiveByClick(li, index) );
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
      uiOptions.classList.toggle('disabled');
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
