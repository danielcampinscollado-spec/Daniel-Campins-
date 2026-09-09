/* DCC premium loader v10 */
(function(){
  function load(src,done){
    var s=document.createElement('script');
    s.src=src;
    s.onload=done||null;
    s.onerror=function(){console.error('No se pudo cargar',src)};
    document.head.appendChild(s);
  }
  load('./coach-premium-v8.js?v=10',function(){
    load('./clients-controls-v10.js?v=10');
  });
})();
