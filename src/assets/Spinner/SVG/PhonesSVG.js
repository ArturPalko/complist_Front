import React from "react";
import contacts from "../../../assets/contacts.png";

const PhonesSVG = ({ counts }) => (
  <div style={{ display: "flex", gap: "10px" }}>
    {/* Підрозділи */}
    <svg width="400" height="60">
      <defs>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="200" height="60" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="200" y="0" width="200" height="60" />
        </clipPath>
      </defs>

      <ellipse cx="200" cy="30" rx="200" ry="30" fill="lightblue" clipPath="url(#leftHalf)" />
      <ellipse cx="200" cy="30" rx="200" ry="30" fill="lightyellow" clipPath="url(#rightHalf)" />

      <rect x={117} y={25} width={60} height={20} fill="rgb(156,156,238)" />
      <text x={117 + 60 / 2} y={27 + 20 / 2} fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfDepartments}
      </text>

      <text x="10" y="30" fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle">
        Самостійні
      </text>

      <text x="150" y="15" fill="black">Підрозділи</text>
      <rect x={220} y={25} width={60} height={20} fill="rgb(252,195,89)" />
      <text x={220 + 60 / 2} y={27 + 20 / 2} fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfSections}
      </text>
      <text x="295" y="30" fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle">
        Не самостійні
      </text>

      <line x1="140" y1="18" x2="235" y2="18" stroke="black" strokeWidth="1" />
    </svg>

    {/* Контакти */}
    <svg width="200" height="60">
      <ellipse cx="100" cy="30" rx="100" ry="30" fill="pink" />
      <image href={contacts} x="20" y="15" width="30" height="30" />
      <text x="60" y="30" fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle">
        Контакти:
      </text>
      <rect x={127} y={20} width={30} height={20} fill="beige" />
      <text x={117 + 50 / 2} y={22 + 20 / 2} fill="black" fontSize="14" fontFamily="Arial" dominantBaseline="middle" textAnchor="middle">
        {counts.countOfUsers}
      </text>
      <line x1="60" y1="37" x2="120" y2="37" stroke="black" strokeWidth="1" />
    </svg>

    {/* Телефони */}
    <svg width="200" height="60">
      <defs>
        <pattern id="threeStripes" patternUnits="userSpaceOnUse" width="200" height="60">
          <rect x="0" width="66.66" height="60" fill="white" />
          <rect x="66.66" width="66.66" height="60" fill="rgba(79,98,98,1)" />
          <rect x="133.32" width="66.68" height="60" fill="white" />
        </pattern>
      </defs>
      <ellipse cx="100" cy="30" rx="100" ry="30" fill="url(#threeStripes)" />
      <rect x={82} y={35} width={40} height={20} fill="white" />
      <rect x={25} y={30} width={30} height={20} fill="black" transform="rotate(-10,30,25)" />
      <rect x={125} y={8} width={30} height={20} fill="black" transform="rotate(10,30,125)" />

      <text x="33.33" y="30" fontSize="18" textAnchor="middle" fill="black" fontFamily="Arial" transform="rotate(-20,15,30)">
        Міські
      </text>
      <text x="40" y="50" fontSize="14" textAnchor="middle" fill="white" fontFamily="Arial" transform="rotate(-12,15,30)">
        {counts.countOfLandlinePhones}
      </text>
      <text x="100" y="25" fontSize="14" textAnchor="middle" fill="white" fontFamily="Arial">Внутрішні</text>
      <text x="100" y="50" fontSize="14" textAnchor="middle" fill="black" fontFamily="Arial">{counts.countOfInternalPhones}</text>
      <text x="166.66" y="37" fontSize="18" textAnchor="middle" fill="black" fontFamily="Arial" transform="rotate(20,200,30)">
        IP Cisco
      </text>
      <text x="135" y="20" fontSize="14" textAnchor="middle" fill="white" fontFamily="Arial" transform="rotate(12,30,125)">
        {counts.countOfCiscoPhones}
      </text>
    </svg>
  </div>
);

export default PhonesSVG;
