import React from 'react';
const drawings=[
 <><path d="m10 28 9-9 7 7-9 9zM22 16l4-4 6 6-4 4M30 10l4-4M35 15h5M25 5V1"/><path d="m10 28-5 7 7-5M31 9l5-5"/><circle cx="22" cy="23" r="2"/></>,
 <><path d="M5 12h7c9 0 9 20 18 20h8m-6-6 6 6-6 6M5 32h7c3 0 5-3 7-6M25 18c2-3 3-6 6-6h7m-6-6 6 6-6 6"/><circle cx="7" cy="22" r="2"/></>,
 <><rect x="3" y="17" width="12" height="13" rx="3"/><rect x="29" y="17" width="12" height="13" rx="3"/><path d="M10 10h23l-5-5M34 36H11l5 5M19 23h6m-3-3 3 3-3 3"/></>,
 <><path d="M4 15h9v14H4zM13 18l7-4v16l-7-4M23 22h18M25 16h13M25 28h13"/><path d="m35 11 5 5-5 5m0 2 5 5-5 5"/></>,
 <><circle cx="22" cy="22" r="5"/><circle cx="22" cy="22" r="13" strokeDasharray="18 5"/><path d="M22 2v6m0 28v6M2 22h6m28 0h6M8 8l4 4m20 20 4 4M8 36l4-4m20-20 4-4"/></>
];
export default function HelperIcon({index}){return <svg className="helper-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[index]}</svg>;}
