/* DCC premium loader v9 */
(function(){
  function load(src,done){
    var s=document.createElement('script');
    s.src=src;
    s.onload=done||null;
    s.onerror=function(){console.error('No se pudo cargar',src)};
    document.head.appendChild(s);
  }
  load('./coach-premium-v8.js?v=9',function(){
    load('./clients-controls-v9.js?v=9');
  });
})();
