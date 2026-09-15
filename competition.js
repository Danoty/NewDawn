(() => {
 const links=[...document.querySelectorAll('[data-event-photo]')];
 const dialog=document.querySelector('[data-event-dialog]');
 if(!dialog || typeof dialog.showModal!=='function')return;
 const photo=dialog.querySelector('[data-event-image]');
 const caption=dialog.querySelector('[data-event-caption]');
 let active=0,trigger;
 const render=()=>{const link=links[active];photo.src=link.href;photo.alt=link.dataset.caption;caption.textContent=`${active+1} / ${links.length} · ${link.dataset.caption}`;};
 links.forEach((link,index)=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();active=index;trigger=link;render();dialog.showModal();}));
 const step=direction=>{active=(active+direction+links.length)%links.length;render();};
 dialog.querySelector('[data-event-prev]').addEventListener('click',()=>step(-1));
 dialog.querySelector('[data-event-next]').addEventListener('click',()=>step(1));
 dialog.querySelector('[data-event-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}if(event.key==='ArrowRight'){event.preventDefault();step(1);}});
 dialog.addEventListener('close',()=>trigger?.focus());
 document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
})();
