import{c as o}from"./index-BOUwPkzv.js";/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],p=o("image",s);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],m=o("info",c);/**
 * @license lucide-react v0.553.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],g=o("trash",d);async function l(r,n){if(!["image/jpeg","image/png","image/webp","image/gif"].includes(r.type))throw new Error("Choose a JPEG, PNG, WebP, or GIF image");if(r.size>4*1024*1024)throw new Error("Image must be 4 MB or smaller");const i=localStorage.getItem("token");if(!i)throw new Error("Please sign in as an admin before uploading an image.");const t=new FormData;t.append("file",r),t.append("type",n);const a=await fetch(`${"https://mtmkay-backend.vercel.app/api".replace(/\/$/,"")}/upload`,{method:"POST",signal:AbortSignal.timeout(3e4),headers:{Authorization:`Bearer ${i}`},body:t});if(a.status===401)throw new Error("Your session is no longer valid. Sign out, sign in again, and retry the upload.");if(a.status===403)throw new Error("An admin account is required to upload images.");const e=await a.json().catch(()=>{throw new Error("Upload service is unavailable")});if(!a.ok)throw new Error(e.error||"Upload failed");if(!e.url||typeof e.url!="string"||!e.url.startsWith("https://"))throw new Error("Upload service returned an invalid image URL");return e.url}export{m as I,g as T,p as a,l as u};
