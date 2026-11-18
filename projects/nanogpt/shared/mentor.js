/* NanoGPT Mentor Explanation: uses the same component contract as Spring Petclinic. */
(function(){'use strict';
const H=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(s){const m=s.mentor||{},t=s.sourceTargets&&s.sourceTargets[0];
 const path=t?.path||s.caption||'',sha=t?.sha||s.sha,line=t?.line;
 const url='https://github.com/karpathy/nanoGPT/blob/'+encodeURIComponent(sha)+'/'+path.split('/').map(encodeURIComponent).join('/')+(line?'#L'+line:'');
 return '<summary class="mentor-head"><span class="mentor-icon">✦</span> MENTOR EXPLANATION <span class="mentor-id">'+H(s.id)+'</span></summary>'+
 '<div class="mentor-content"><div class="mentor-part"><b>Why does this matter?</b><p>'+H(m.idea||'This source change belongs to nanoGPT at the selected GitHub commit.')+'</p></div>'+
 '<div class="mentor-part"><b>Now connect it to the source</b><p>'+H(m.reason||'Study the displayed lines from the exact historical revision.')+'</p></div>'+
 '<div class="mentor-follow"><span>READ THE REAL CODE</span><a href="'+H(url)+'" target="_blank" rel="noopener noreferrer">'+H(path.split('/').pop())+(line?' · L'+line:'')+' ↗</a></div></div>';
} window.THREE_LANES_MENTOR=Object.freeze({render});})();
